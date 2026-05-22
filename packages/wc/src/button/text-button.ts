import { customElement, property } from "lit/decorators.js";

import { Button } from "./button.js";
import { type ButtonVariant } from "./types.js";

@customElement("mwc-text-button")
export class TextButton extends Button {
  @property({ reflect: true })
  override variant: ButtonVariant = "text";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-text-button": TextButton;
  }
}
