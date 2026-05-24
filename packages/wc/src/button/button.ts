import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { PASS_THROUGH_PROPS } from "../link/constants.js";
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

const INVALID_LINK_TYPES = new Set(["button", "submit", "reset"]);

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

  // link only properties
  @property()
  rel?: string;

  @property()
  href: string = "";

  @property()
  hreflang?: string;

  @property()
  target?: string;

  @property()
  download?: string;

  @property()
  referrerPolicy?: string;

  @property()
  ping?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    // I do not support adding an href later
    if (this.href && this.internals) {
      this.role = "link";
      this.internals.role = "link";
      this.addEventListener("auxclick", this.#handleMiddleClick);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("auxclick", this.#handleMiddleClick);
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <mwc-elevation></mwc-elevation>
    `;
  }

  override handleClick(event: MouseEvent): void {
    super.handleClick(event);

    if (this.href) {
      this.#clickLink(event.ctrlKey);
      return;
    }

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

  #clickLink(forceNewTab = false): void {
    const link = document.createElement("a");
    for (const name of PASS_THROUGH_PROPS) {
      const value = this[name];
      if (
        value !== undefined &&
        (name !== "type" || INVALID_LINK_TYPES.has(value))
      ) {
        link[name] = value;
      }
    }

    if (forceNewTab) {
      link.target = "_blank";
    }

    link.click();
  }

  #handleMiddleClick(event: MouseEvent): void {
    if (event.button === 1) {
      event.preventDefault();
      this.#clickLink(true);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-button": Button;
  }
}
