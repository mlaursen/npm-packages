export function isShadowRootNode(
  node: Node,
): node is HTMLElement & { shadowRoot: ShadowRoot } {
  return node instanceof HTMLElement && !!node.shadowRoot;
}

const never = (): boolean => false;

export interface TraverseOptions<E extends HTMLElement> {
  root: Node;
  check: (node: Node) => node is E;
  first?: boolean;
  ignore?: (node: Node) => boolean;
  filter?: NodeFilter | null | undefined;
}

export function traverse<E extends HTMLElement>(
  options: Readonly<TraverseOptions<E>> & { first: true },
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
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (ignore(node)) {
      continue;
    }

    if (check(node)) {
      if (first) {
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

  return first ? undefined : elements;
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
