import { DialogTitle } from "../dialog-title/dialog-title.js";
import type { TypographySize, TypographyVariant } from "../typography/types.js";

export class SheetTitle extends DialogTitle {
  static override readonly elementName: string = "mwc-sheet-title";

  override size: TypographySize = "large";
  override variant: TypographyVariant = "title";
}
