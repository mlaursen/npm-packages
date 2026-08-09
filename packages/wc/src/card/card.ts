import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type {
  BoxAlignItems,
  BoxGap,
  BoxGrid,
  BoxJustifyContent,
  BoxPadding,
} from "../box/types.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./card-styles.js";
import type { CardShape, CardVariant } from "./types.js";

const BaseCard = PaletteMixin(MarginMixin(LitElement));

@customElement("mwc-card")
export class Card extends BaseCard {
  static override styles = [...BaseCard.styles, styles];

  /** Pass-through box property */
  @property()
  align: BoxAlignItems = "stretch";

  /** Pass-through box property */
  @property()
  justify: BoxJustifyContent = "stretch";

  /** Pass-through box property */
  @property({ type: Boolean })
  inline = false;

  /** Pass-through box property */
  @property()
  grid: BoxGrid = false;

  /** Pass-through box property */
  @property({ type: Boolean })
  stacked = true;

  /** Pass-through box property */
  @property({ type: Boolean })
  reversed?: boolean;

  /** Pass-through box property */
  @property()
  gap: BoxGap = "none";

  /** Pass-through box property */
  @property({ type: Boolean })
  nowrap = true;

  /** Pass-through box property */
  @property()
  padding: BoxPadding = "none";

  @property({ reflect: true })
  variant: CardVariant = "elevated";

  @property({ reflect: true })
  shape: CardShape = "round";

  override render(): TemplateResult {
    return html`
      <mwc-box
        class="container"
        align=${this.align}
        justify=${this.justify}
        gap=${this.gap}
        padding=${this.padding}
        .grid=${this.grid}
        .inline=${this.inline}
        .nowrap=${this.nowrap}
        .stacked=${this.stacked}
        .reversed=${this.reversed}
        full-width
      >
        <slot></slot>
      </mwc-box>
      <mwc-elevation></mwc-elevation>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-card": Card;
  }
}
