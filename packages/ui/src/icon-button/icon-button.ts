import { customElement, property } from "lit/decorators.js";

import { Button } from "../button/button.js";
import styles from "./icon-button-styles.js";
import { type IconButtonWidth } from "./types.js";

@customElement("ui-icon-button")
export class IconButton extends Button {
  static override styles = [...Button.styles, styles];

  @property()
  width?: IconButtonWidth | null;
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-icon-button": IconButton;
  }
}
