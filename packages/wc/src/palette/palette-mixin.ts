import { property } from "lit/decorators.js";

import type {
  StylableLitElement,
  StyledLitElementWithProperties,
} from "../types.js";
import { mergeStyles } from "../utils/mergeStyles.js";
import styles from "./palette-styles.js";
import type {
  PaletteBackgroundColor,
  PaletteProperties,
  PaletteTextColor,
} from "./types.js";

export function PaletteMixin<T extends StylableLitElement>(
  Base: T,
): StyledLitElementWithProperties<PaletteProperties, T> {
  class PaletteStyledElement extends Base implements PaletteProperties {
    static override styles = mergeStyles(Base, styles);

    @property()
    background?: PaletteBackgroundColor;

    @property()
    color?: PaletteTextColor;
  }

  return PaletteStyledElement;
}
