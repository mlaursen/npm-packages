import { property } from "lit/decorators.js";

import { Box } from "../box/box.js";
import type { BoxJustifyContent } from "../box/types.js";
import styles from "./dialog-actions-styles.js";

export class DialogActions extends Box {
  static override styles = [...Box.styles, styles];

  @property({ reflect: true })
  override justify: BoxJustifyContent = "end";
}
