import { type CSSResultArray } from "lit";
import { property } from "lit/decorators.js";

import {
  type StylableLitElement,
  type StyledLitElementWithProperties,
} from "../types.js";
import paletteStyles from "./palette-styles.js";
import { type PaletteBackgroundColor, type PaletteTextColor } from "./types.js";

export interface PaletteMixinProperties {
  bg?: PaletteBackgroundColor;
  color?: PaletteTextColor;
}

export function PaletteMixin<T extends StylableLitElement>(
  Base: T,
): StyledLitElementWithProperties<PaletteMixinProperties, T> {
  let styles: CSSResultArray = [paletteStyles];
  if (Base.styles) {
    const baseStyles = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    styles = [paletteStyles, ...baseStyles];
  }

  class PaletteStyledElement extends Base {
    static override styles = styles;

    @property()
    bg?: PaletteBackgroundColor;

    @property()
    color?: PaletteTextColor;
  }

  return PaletteStyledElement;
}
