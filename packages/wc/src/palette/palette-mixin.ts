import { type CSSResultArray } from "lit";
import { property } from "lit/decorators.js";

import {
  type StylableLitElement,
  type StyledLitElementWithProperties,
} from "../types.js";
import paletteStyles from "./palette-styles.js";
import {
  type PaletteBackgroundColor,
  type PaletteProperties,
  type PaletteTextColor,
} from "./types.js";

export function PaletteMixin<T extends StylableLitElement>(
  Base: T,
): StyledLitElementWithProperties<PaletteProperties, T> {
  let styles: CSSResultArray = [paletteStyles];
  if (Base.styles) {
    const baseStyles = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    styles = [paletteStyles, ...baseStyles];
  }

  class PaletteStyledElement extends Base implements PaletteProperties {
    static override styles = styles;

    @property()
    background?: PaletteBackgroundColor;

    @property()
    color?: PaletteTextColor;
  }

  return PaletteStyledElement;
}
