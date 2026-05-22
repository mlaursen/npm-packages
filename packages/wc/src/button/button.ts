import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./button-styles.js";
import {
  type ButtonProperties,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from "./types.js";

const BaseStyledButton = InteractionMixin(
  PaletteMixin(MarginMixin(LitElement)),
);
const BaseButton = AriaMixin(BaseStyledButton, "button");

@customElement("mwc-button")
export class Button extends BaseButton implements ButtonProperties {
  static override styles = [...BaseButton.styles, styles];
  static formAssociated = true;

  @property()
  type: HTMLButtonElement["type"] = "submit";

  @property({ reflect: true })
  size: ButtonSize = "small";

  @property({ reflect: true })
  shape: ButtonShape = "round";

  @property({ reflect: true })
  variant: ButtonVariant = "filled";

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <mwc-elevation></mwc-elevation>
    `;
  }

  override handleClick(event: MouseEvent): void {
    super.handleClick(event);
    const form = this.internals?.form;
    if (!form || this.type === "button") {
      return;
    }

    if (this.type === "submit") {
      form.requestSubmit();
    } else {
      form.reset();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-button": Button;
  }
}
