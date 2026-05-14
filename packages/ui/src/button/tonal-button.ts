import { customElement, property } from "lit/decorators.js";

import { Button } from "./button.js";
import { type ButtonVariant } from "./types.js";

@customElement("ui-tonal-button")
export class TonalButton extends Button {
  @property({ reflect: true })
  override variant: ButtonVariant = "tonal";
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-tonal-button": TonalButton;
  }
}
