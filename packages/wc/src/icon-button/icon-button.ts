import { customElement, property } from "lit/decorators.js";

import { Button } from "../button/button.js";
import type { ButtonVariant } from "../button/types.js";
import styles from "./icon-button-styles.js";
import { type IconButtonProperties, type IconButtonWidth } from "./types.js";

@customElement("mwc-icon-button")
export class IconButton extends Button implements IconButtonProperties {
  static override styles = [...Button.styles, styles];

  @property({ reflect: true })
  override variant: ButtonVariant = "text";

  @property()
  width: IconButtonWidth | null = null;
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-icon-button": IconButton;
  }
}
