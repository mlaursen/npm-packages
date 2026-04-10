import { LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit/static-html.js";

import { MarginMixin } from "../styling/margin.js";
import { type TypographySize, type TypographyVariant } from "./types.js";
import styles from "./typography-styles.js";

const BaseTypography = MarginMixin(LitElement);

@customElement("mwc-typography")
export class Typography extends BaseTypography {
  static override styles = [...BaseTypography.styles, styles];

  /**
   * Default: `"large"`
   */
  @property({ reflect: true })
  size: TypographySize = "large";

  /**
   * Default: `"body"`
   */
  @property({ reflect: true })
  variant: TypographyVariant = "body";

  /**
   * Default: `"body"`
   */
  @property({ type: Boolean })
  prominent = false;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-typography": Typography;
  }
}
