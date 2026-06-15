import { traverse } from "../utils/traverse.js";
import { FOCUSABLE, NOT_DISABLED_OR_HIDDEN } from "./constants.js";

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
  return traverse({
    root,
    check: isFocusable,
    ignore: (node) => node === firstFocusTrap || node === lastFocusTrap,
  });
}

function isAutoFocusable(node: Node): node is HTMLElement {
  return (
    node instanceof HTMLElement && node.matches("[autofocus]:not([hidden])")
  );
}

export function getAutoFocusElement(root: Node): HTMLElement | undefined {
  return traverse({
    root,
    check: isAutoFocusable,
    first: true,
    filter: {
      acceptNode(node) {
        if (node instanceof HTMLElement && node.checkVisibility()) {
          return NodeFilter.FILTER_ACCEPT;
        }

        return NodeFilter.FILTER_REJECT;
      },
    },
  });
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
