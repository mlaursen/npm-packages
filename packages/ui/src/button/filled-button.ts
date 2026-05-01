import { customElement, property } from "lit/decorators.js";

import { Button } from "./button.js";
import { type ButtonVariant } from "./types.js";

@customElement("ui-filled-button")
export class FilledButton extends Button {
  @property({ reflect: true })
  override variant: ButtonVariant = "filled";
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-filled-button": FilledButton;
  }
}
