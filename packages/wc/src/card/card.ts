import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import type {
  BoxAlignItems,
  BoxGap,
  BoxGrid,
  BoxJustifyContent,
  BoxPadding,
} from "../box/types.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./card-styles.js";
import type { CardShape, CardVariant } from "./types.js";

const BaseStyledCard = PaletteMixin(
  MarginMixin(InteractionMixin(LitElement, true)),
);
const BaseCard = AriaMixin(BaseStyledCard, "button");

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
  nowrap?: boolean;

  /** Pass-through box property */
  @property()
  padding: BoxPadding = "none";

  @property({ reflect: true })
  variant: CardVariant = "elevated";

  @property({ reflect: true })
  shape: CardShape = "round";

  @property({ type: Boolean })
  clickable = false;

  @property({ type: Boolean })
  dragging = false;

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (!changed.has("disabled") && !changed.has("clickable")) {
      return;
    }

    if (this.clickable) {
      this.tabIndex = this.disabled ? -1 : 0;
    } else {
      this.internals.role = null;
      this.removeAttribute("tabIndex");
    }
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (!this.clickable) {
      // these have to be in `updated` due to timing of `@property({ reflect: true })`
      this.removeAttribute("role");
      this.removeAttribute("interaction");
    }
  }

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
      ${this.#renderInteraction()}
    `;
  }

  override isDisabled(): boolean {
    return !this.clickable || super.isDisabled();
  }

  #renderInteraction(): TemplateResult | null {
    if (!this.clickable) {
      return null;
    }

    return html`${this._renderStateLayer()} ${this._renderRipple()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-card": Card;
  }
}
