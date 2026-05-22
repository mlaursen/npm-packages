import { customElement, property } from "lit/decorators.js";

import { Button } from "./button.js";
import { type ButtonVariant } from "./types.js";

@customElement("mwc-elevated-button")
export class ElevatedButton extends Button {
  @property({ reflect: true })
  override variant: ButtonVariant = "elevated";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-elevated-button": ElevatedButton;
  }
}
