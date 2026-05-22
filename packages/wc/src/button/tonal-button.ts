import { customElement, property } from "lit/decorators.js";

import { Button } from "./button.js";
import { type ButtonVariant } from "./types.js";

@customElement("mwc-tonal-button")
export class TonalButton extends Button {
  @property({ reflect: true })
  override variant: ButtonVariant = "tonal";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-tonal-button": TonalButton;
  }
}
