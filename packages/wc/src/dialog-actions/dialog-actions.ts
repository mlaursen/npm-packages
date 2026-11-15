import { Box } from "../box/box.js";
import type { BoxJustifyContent } from "../box/types.js";
import styles from "./dialog-actions-styles.js";

export class DialogActions extends Box {
  static override styles = [...Box.styles, styles];
  static override readonly elementName: string = "mwc-dialog-actions";

  override justify: BoxJustifyContent = "end";
}
