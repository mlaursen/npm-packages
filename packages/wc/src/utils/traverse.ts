/**
 * @returns `true` if the node is an `HTMLElement` with a `ShadowRoot`
 */
export function isShadowRootNode(
  node: Node,
): node is HTMLElement & { shadowRoot: ShadowRoot } {
  return node instanceof HTMLElement && !!node.shadowRoot;
}

const never = (): boolean => false;

export type TraverseCheck<E extends HTMLElement = HTMLElement> = (
  node: Node,
) => node is E;

export interface TraverseOptions<E extends HTMLElement = HTMLElement> {
  root: Node;
  check: TraverseCheck<E>;

  /**
   * If this is `true` it will return the first element that matches the
   * {@link check}.
   *
   * If this is a function, it will return the first node that returns `true`
   * when called. Otherwise, it will return the first node that matches the
   * {@link check}. If both failed, returns `undefined`.
   */
  first?: boolean | TraverseCheck<E>;
  ignore?: (node: Node) => boolean;
  filter?: NodeFilter | null | undefined;
}

/**
 * This is an internal util for traversing the shadow dom to find elements.
 */
export function traverse<E extends HTMLElement>(
  options: Readonly<TraverseOptions<E>> & {
    first: true | TraverseCheck<E>;
  },
): E | undefined;
export function traverse<E extends HTMLElement>(
  options: Readonly<TraverseOptions<E>> & { first?: false | never },
): readonly E[];
export function traverse<E extends HTMLElement>(
  options: Readonly<TraverseOptions<E>>,
): readonly E[] | E | undefined;
export function traverse<E extends HTMLElement>(
  options: Readonly<TraverseOptions<E>>,
): readonly E[] | E | undefined {
  const { root, first, check, ignore = never, filter } = options;
  const elements: E[] = [];
  if (isShadowRootNode(root)) {
    const result = traverse({ ...options, ignore, root: root.shadowRoot });
    if (Array.isArray(result)) {
      elements.push(...result);
    } else if (result) {
      return result;
    }
  }

  const treeWalker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    filter,
  );

  let fallback: E | undefined;
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (ignore(node)) {
      continue;
    }

    if (check(node)) {
      if (typeof first === "function") {
        if (first(node)) {
          return node;
        }

        fallback ??= node;
      } else if (first) {
        return node;
      }

      elements.push(node);
    } else if (isShadowRootNode(node)) {
      const result = traverse({ ...options, ignore, root: node.shadowRoot });
      if (Array.isArray(result)) {
        elements.push(...result);
      } else if (result) {
        return result;
      }
    }
  }

  if (first) {
    return fallback;
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
