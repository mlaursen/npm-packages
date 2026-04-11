import { type CSSResultArray } from "lit";
import { property } from "lit/decorators.js";

import {
  type StylableLitElement,
  type StyledLitElementWithProperties,
} from "../types.js";
import marginStyles from "./margin-styles.js";
import { type Margin, type MarginProperties } from "./types.js";

export function MarginMixin<T extends StylableLitElement>(
  Base: T,
): StyledLitElementWithProperties<MarginProperties, T> {
  let styles: CSSResultArray = [marginStyles];
  if (Base.styles) {
    const baseStyles = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    styles = [marginStyles, ...baseStyles];
  }

  class MarginStyledElement extends Base {
    static override styles = styles;

    @property()
    margin?: Margin;
  }

  return MarginStyledElement;
}
