import type { Margin } from "../margin/types.js";
import type { PaletteTextColor } from "../palette/types.js";
import type { TypographyVariant } from "../typography/types.js";
import { Typography } from "../typography/typography.js";

export class DialogTitle extends Typography {
  static override readonly elementName: string = "mwc-dialog-title";

  override margin: Margin = "none";
  override variant: TypographyVariant = "headline";
  override color: PaletteTextColor = "on-surface-variant";
}
