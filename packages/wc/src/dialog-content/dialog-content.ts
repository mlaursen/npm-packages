import type { Margin } from "../margin/types.js";
import type { PaletteTextColor } from "../palette/types.js";
import type { TypographySize } from "../typography/types.js";
import { Typography } from "../typography/typography.js";
import styles from "./dialog-content-styles.js";
import type { DialogContentProperties } from "./types.js";

export class DialogContent
  extends Typography
  implements DialogContentProperties
{
  static override styles = [...Typography.styles, styles];
  static override readonly elementName: string = "mwc-dialog-content";

  override size: TypographySize = "medium";
  override color: PaletteTextColor = "on-surface-variant";
  override margin: Margin = "none";
}
