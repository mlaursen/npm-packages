import type { Margin } from "../margin/types.js";
import type { PaletteTextColor } from "../palette/types.js";
import type {
  TypographyProperties,
  TypographySize,
} from "../typography/types.js";

export interface DialogContentProperties extends TypographyProperties {
  /**
   * @defaultValue `"medium"`
   * @override
   */
  size: TypographySize;

  /**
   * @defaultValue `"on-surface-variant"`
   * @override
   */
  color: PaletteTextColor;

  /**
   * @defaultValue `"none"`
   * @override
   */
  margin: Margin;
}
