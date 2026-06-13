import { customElement, property } from "lit/decorators.js";

import { type Margin } from "../margin/types.js";
import { type PaletteTextColor } from "../palette/types.js";
import { type TypographyVariant } from "../typography/types.js";
import { Typography } from "../typography/typography.js";

@customElement("mwc-dialog-title")
export class DialogTitle extends Typography {
  @property({ reflect: true })
  override margin: Margin = "none";

  @property({ reflect: true })
  override variant: TypographyVariant = "headline";

  @property({ reflect: true })
  override color: PaletteTextColor = "on-surface-variant";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-title": DialogTitle;
  }
}
