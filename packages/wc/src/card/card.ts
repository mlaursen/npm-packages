import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
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
import type { CardProperties, CardShape, CardVariant } from "./types.js";

const BaseCard = PaletteMixin(MarginMixin(LitElement));

/**
 * The card component is generally used to display lists of data with actions
 * in flex or grid layout or add elevation and background to display responsive
 * images. This component is usually used alongside the following components:
 * - `<mwc-box>`
 * - `<mwc-typography>`
 * - `<mwc-object-fit>`
 * - `<mwc-button>`
 *
 * @example Simple Action
```html
<mwc-box grid>
  <mwc-card padding="all" gap="column">
    <mwc-typography variant="display" size="medium" margin="none">
      <h3>Title</h3>
    </mwc-typography>
    <mwc-typography variant="title" margin="none">
      <h4>Subtitle</h4>
    </mwc-typography>
    <mwc-typography margin="none">
      <p>
        Explain more about the topic shown in the medium display and subhead
        through supporting text here.
      </p>
    </mwc-typography>
    <mwc-box padding="block" justify="end">
      <mwc-button>Read More</mwc-button>
    </mwc-box>
  </mwc-card>
</mwc-box>
```
 *
 * @slot - The default slot content that is placed within a `<mwc-box>`.
 */
@customElement("mwc-card")
export class Card extends BaseCard implements CardProperties {
  static override styles = [...BaseCard.styles, styles];

  @property()
  align: BoxAlignItems = "stretch";

  @property()
  justify: BoxJustifyContent = "stretch";

  @property({ type: Boolean })
  inline = false;

  @property()
  grid: BoxGrid = false;

  @property({ type: Boolean })
  stacked = true;

  @property({ type: Boolean })
  reversed?: boolean;

  @property()
  gap: BoxGap = "none";

  @property({ type: Boolean })
  nowrap = true;

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
