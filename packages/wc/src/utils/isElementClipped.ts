/**
 * Checks if an element has been clipped meaning it has overflown.
 */
export function isElementClipped(node: Node): node is HTMLElement {
  if (!(node instanceof HTMLElement)) {
    return false;
  }

  const { overflowX, overflowY } = globalThis.getComputedStyle(node);
  if (overflowX === "visible" && overflowY === "visible") {
    return false;
  }

  return (
    node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight
  );
}
