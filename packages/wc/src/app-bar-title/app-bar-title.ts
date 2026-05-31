import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  type AppBarSize,
  type AppBarTitlePosition,
  type AppBarTitleProperties,
} from "../app-bar/types.js";
import {
  type TypographySize,
  type TypographyVariant,
} from "../typography/types.js";
import styles from "./app-bar-title-styles.js";

@customElement("mwc-app-bar-title")
export class AppBarTitle extends LitElement implements AppBarTitleProperties {
  static override styles = styles;

  @property()
  size: AppBarSize = "small";

  @property({ type: Boolean })
  subtitle?: boolean;

  @property()
  position: AppBarTitlePosition = "start";

  override render(): TemplateResult {
    let size: TypographySize = "large";
    let variant: TypographyVariant = "title";
    if (this.size === "medium") {
      size = "medium";
      variant = "headline";
    } else if (this.size === "large") {
      size = "small";
      variant = "display";
    }

    return html`
      <mwc-typography size=${size} variant=${variant}>
        <slot></slot>
      </mwc-typography>
      ${this.#renderSubtitle()}
    `;
  }

  #renderSubtitle(): TemplateResult | null {
    if (!this.subtitle) {
      return null;
    }

    let size: TypographySize = "medium";
    let variant: TypographyVariant = "label";
    if (this.size === "medium") {
      size = "small";
      variant = "title";
    } else if (this.size === "large") {
      size = "medium";
      variant = "title";
    }

    return html`
      <mwc-typography
        color="on-surface-variant"
        size=${size}
        variant=${variant}
      >
        <slot name="subtitle"></slot>
      </mwc-typography>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-app-bar-title": AppBarTitle;
  }
}
