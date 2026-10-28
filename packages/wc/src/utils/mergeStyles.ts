import type { CSSResult, CSSResultArray } from "lit";

import type { StylableLitElement } from "../types.js";

/**
 * This util is used for merging styles for mixins.
 */
export function mergeStyles(
  Base: StylableLitElement,
  styles: CSSResult,
): CSSResultArray {
  let merged: CSSResultArray = [styles];
  if (Base.styles) {
    const base = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    merged = [...base, styles];
  }

  return merged;
}
