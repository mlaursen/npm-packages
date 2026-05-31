import { LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit/static-html.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import {
  type TypographyProperties,
  type TypographySize,
  type TypographyVariant,
} from "./types.js";
import styles from "./typography-styles.js";

const BaseTypography = PaletteMixin(MarginMixin(LitElement));

/**
 * @example Simple Example
 * ```ts
 * <mwc-typography variant="display">
 *   <h1>This is a large display</h1>
 * </mwc-typography>
 * <mwc-typography>
 *   <p>This is a large body typography variant</p>
 * </mwc-typography>
 * ```
 */
@customElement("mwc-typography")
export class Typography extends BaseTypography implements TypographyProperties {
  static override styles = [...BaseTypography.styles, styles];

  @property({ reflect: true })
  size: TypographySize = "large";

  @property({ reflect: true })
  variant: TypographyVariant = "body";

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
