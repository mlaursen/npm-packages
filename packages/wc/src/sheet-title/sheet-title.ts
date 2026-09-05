import { property } from "lit/decorators.js";

import { DialogTitle } from "../dialog-title/dialog-title.js";
import type { TypographySize, TypographyVariant } from "../typography/types.js";

export class SheetTitle extends DialogTitle {
  @property()
  override size: TypographySize = "large";

  @property()
  override variant: TypographyVariant = "title";
}
