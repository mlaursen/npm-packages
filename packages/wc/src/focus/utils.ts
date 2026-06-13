const IS_FOCUSABLE =
  ":is(input, button, textarea, select, :is(a,area)[href], [tabindex], [contenteditable])";
const NOT_DISABLED = ":not(:disabled, [disabled])";
const NOT_NEGATIVE_TABINDEX = ':not([tabindex^="-"])';
const FOCUSABLE = `${IS_FOCUSABLE}${NOT_DISABLED}${NOT_NEGATIVE_TABINDEX}`;

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

  if (!element.localName.includes("-") || element.matches(NOT_DISABLED)) {
    return false;
  }

  return element.shadowRoot?.delegatesFocus ?? false;
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
  firstFocusTrap: HTMLElement,
  lastFocusTrap: HTMLElement,
): readonly HTMLElement[] {
  const elements: HTMLElement[] = [];
  if (root instanceof HTMLElement && root.shadowRoot) {
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
    } else if (node instanceof HTMLElement && node.shadowRoot) {
      elements.push(
        ...getFocusableElements(node.shadowRoot, firstFocusTrap, lastFocusTrap),
      );
    }
  }

  return elements;
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
