const IS_FOCUSABLE =
  ":is(input, button, textarea, select, :is(a,area)[href], [tabindex], [contenteditable])";
const NOT_DISABLED_OR_HIDDEN = ":not(:disabled, [disabled], [hidden])";
const NOT_NEGATIVE_TABINDEX = ':not([tabindex^="-"])';
const FOCUSABLE = `${IS_FOCUSABLE}${NOT_DISABLED_OR_HIDDEN}${NOT_NEGATIVE_TABINDEX}`;

/**
 * @private
 */
export function isFocusable(element: Element | Node): element is HTMLElement {
  if (!("matches" in element)) {
    return false;
  }

  if (element.matches(FOCUSABLE)) {
    return true;
  }

  if (
    !element.localName.includes("-") ||
    element.matches(NOT_DISABLED_OR_HIDDEN)
  ) {
    return false;
  }

  return element.shadowRoot?.delegatesFocus ?? false;
}

function isShadowRootNode(
  node: Node,
): node is HTMLElement & { shadowRoot: ShadowRoot } {
  return node instanceof HTMLElement && !!node.shadowRoot;
}

/**
 * This traverses the shadow dom to find all the focusable nodes and ensure
 * focus is contained. This was added since focus was missed when rendering a
 * `mwc-sheet-header` that had focusable buttons inside that were not picked up
 * from the `mwc-sheet`.
 *
 * @private
 */
export function getFocusableElements(
  root: Node,
  firstFocusTrap: HTMLElement | undefined,
  lastFocusTrap: HTMLElement | undefined,
): readonly HTMLElement[] {
  const elements: HTMLElement[] = [];
  if (isShadowRootNode(root)) {
    elements.push(
      ...getFocusableElements(root.shadowRoot, firstFocusTrap, lastFocusTrap),
    );
  }

  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (node === firstFocusTrap || node === lastFocusTrap) {
      continue;
    }

    if (isFocusable(node)) {
      elements.push(node);
    } else if (isShadowRootNode(node)) {
      elements.push(
        ...getFocusableElements(node.shadowRoot, firstFocusTrap, lastFocusTrap),
      );
    }
  }

  return elements;
}

export function getAutoFocusElement(root: Node): HTMLElement | undefined {
  const match = isShadowRootNode(root) && getAutoFocusElement(root.shadowRoot);
  if (match) {
    return match;
  }

  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node instanceof HTMLElement && node.checkVisibility()) {
        return NodeFilter.FILTER_ACCEPT;
      }

      return NodeFilter.FILTER_REJECT;
    },
  });
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (!(node instanceof HTMLElement)) {
      continue;
    }

    if (node.matches("[autofocus]:not([hidden])")) {
      return node;
    }

    if (isShadowRootNode(node)) {
      const match = getAutoFocusElement(node.shadowRoot);
      if (match) {
        return match;
      }
    }
  }

  return;
}

/**
 * @private
 */
export function isWithinRoot(root: Node, node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current === root) {
      return true;
    }

    current = current.parentNode ?? (current as ShadowRoot).host;
  }

  return false;
}
