import { customElement, property } from "lit/decorators.js";

import { DialogTitle } from "../dialog-title/dialog-title.js";
import {
  type TypographySize,
  type TypographyVariant,
} from "../typography/types.js";

@customElement("mwc-sheet-title")
export class SheetTitle extends DialogTitle {
  @property()
  override size: TypographySize = "large";

  @property()
  override variant: TypographyVariant = "title";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sheet-title": SheetTitle;
  }
}
