import { customElement, property } from "lit/decorators.js";

import { type Margin } from "../margin/types.js";
import { type PaletteTextColor } from "../palette/types.js";
import { type TypographySize } from "../typography/types.js";
import { Typography } from "../typography/typography.js";
import styles from "./dialog-content-styles.js";

@customElement("mwc-dialog-content")
export class DialogContent extends Typography {
  static override styles = [...Typography.styles, styles];

  @property({ reflect: true })
  override size: TypographySize = "medium";

  @property({ reflect: true })
  override color: PaletteTextColor = "on-surface-variant";

  @property({ reflect: true })
  override margin: Margin = "none";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-content": DialogContent;
  }
}
