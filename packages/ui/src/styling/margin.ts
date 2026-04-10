import { type CSSResultArray } from "lit";

import {
  type MixedStylableLitElement,
  type StylableLitElement,
} from "../types.js";
import marginStyles from "./margin-styles.js";

export function MarginMixin<T extends StylableLitElement>(
  Base: T,
): MixedStylableLitElement<T> {
  let styles: CSSResultArray = [marginStyles];
  if (Base.styles) {
    const baseStyles = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    styles = [marginStyles, ...baseStyles];
  }

  return class MarginStyledElement extends Base {
    static override styles = styles;
  };
}
