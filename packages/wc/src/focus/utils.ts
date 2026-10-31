import { traverse, type TraverseOptions } from "../utils/traverse.js";
import {
  FOCUSABLE,
  NOT_DISABLED_OR_HIDDEN,
  PROGRAMMATICALLY_FOCUSABLE,
} from "./constants.js";

/**
 * @private
 */
export function isFocusable(
  element: Element | Node,
  programmatic?: boolean,
): element is HTMLElement {
  if (!("matches" in element)) {
    return false;
  }

  const query = programmatic ? PROGRAMMATICALLY_FOCUSABLE : FOCUSABLE;
  if (element.matches(query)) {
    return true;
  }

  if (
    !element.localName.includes("-") ||
    !element.matches(NOT_DISABLED_OR_HIDDEN)
  ) {
    return false;
  }

  return element.shadowRoot?.delegatesFocus ?? false;
}

export interface GetFocusableElementsOptions extends Omit<
  TraverseOptions,
  "check" | "first"
> {
  programmatic?: boolean;
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
  options: GetFocusableElementsOptions,
): readonly HTMLElement[] {
  const { programmatic, ...traverseOptions } = options;

  return traverse({
    ...traverseOptions,
    check: (node) => isFocusable(node, programmatic),
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
