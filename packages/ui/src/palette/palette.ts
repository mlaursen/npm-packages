import { type CSSResultArray } from "lit";

import {
  type MixedStylableLitElement,
  type StylableLitElement,
} from "../types.js";
import paletteStyles from "./palette-styles.js";

export function PaletteMixin<T extends StylableLitElement>(
  Base: T,
): MixedStylableLitElement<T> {
  let styles: CSSResultArray = [paletteStyles];
  if (Base.styles) {
    const baseStyles = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    styles = [paletteStyles, ...baseStyles];
  }

  return class PaletteStyledElement extends Base {
    static override styles = styles;
  };
}
