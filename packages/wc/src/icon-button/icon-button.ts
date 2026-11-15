import { property } from "lit/decorators.js";

import { Button } from "../button/button.js";
import type { ButtonVariant } from "../button/types.js";
import styles from "./icon-button-styles.js";
import type { IconButtonProperties, IconButtonWidth } from "./types.js";

export class IconButton extends Button implements IconButtonProperties {
  static override styles = [...Button.styles, styles];
  static override readonly elementName: string = "mwc-icon-button";

  override variant: ButtonVariant = "text";

  @property({ reflect: true })
  width: IconButtonWidth | null = null;
}
