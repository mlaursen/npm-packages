import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { InteractionMixin } from "../interaction/interaction.js";
import { MarginMixin } from "../margin/margin.js";
import { PaletteMixin } from "../palette/palette.js";
import styles from "./button-styles.js";
import {
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from "./types.js";

const BaseButton = InteractionMixin(PaletteMixin(MarginMixin(LitElement)));

@customElement("ui-button")
export class Button extends BaseButton {
  static override styles = [...BaseButton.styles, styles];
  static formAssociated = true;

  @property()
  type: HTMLButtonElement["type"] = "button";

  @property({ reflect: true })
  size: ButtonSize = "small";

  @property({ reflect: true })
  shape: ButtonShape = "round";

  @property({ reflect: true })
  variant: ButtonVariant = "filled";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @query("slot[name=button] button")
  override focusTarget?: Element | null;

  override render(): TemplateResult {
    return html`
      <slot name="button">
        <button id="button" ?disabled=${this.disabled}>
          <slot></slot>
        </button>
      </slot>
      <ui-elevation></ui-elevation>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-button": Button;
  }
}
