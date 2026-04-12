import { LitElement, type TemplateResult, html, isServer } from "lit";
import { customElement, property } from "lit/decorators.js";

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
  type: HTMLButtonElement["type"] = "submit";

  @property({ reflect: true })
  size: ButtonSize = "small";

  @property({ reflect: true })
  shape: ButtonShape = "round";

  @property({ reflect: true })
  variant: ButtonVariant = "filled";

  #internals?: ElementInternals;

  constructor() {
    super();
    if (isServer) {
      return;
    }

    this.#internals = this.attachInternals();
    this.#internals.role = "button";
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("click", this.#handleClick);
    this.addEventListener("keydown", this.#handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("click", this.#handleClick);
    this.removeEventListener("keydown", this.#handleKeyDown);
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <ui-elevation></ui-elevation>
    `;
  }

  #isDisabled(): boolean {
    return this.disabled || this.ariaDisabled === "true";
  }

  #handleClick(event: MouseEvent): void {
    if (this.#isDisabled()) {
      event.stopPropagation();
    }

    this.#click();
  }

  #click(): void {
    const form = this.#internals?.form;
    if (!form || this.type === "button" || this.#isDisabled()) {
      return;
    }

    if (this.type === "submit") {
      form.requestSubmit();
    } else {
      form.reset();
    }
  }

  #handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      // do not scroll the page
      if (event.key === " ") {
        event.preventDefault();
      }
      this.click();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-button": Button;
  }
}
