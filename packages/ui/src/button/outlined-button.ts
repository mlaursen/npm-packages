import { customElement, property } from "lit/decorators.js";

import { Button } from "./button.js";
import { type ButtonVariant } from "./types.js";

@customElement("ui-outlined-button")
export class OutlinedButton extends Button {
  @property({ reflect: true })
  override variant: ButtonVariant = "outlined";
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-outlined-button": OutlinedButton;
  }
}
