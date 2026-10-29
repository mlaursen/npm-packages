import { spread } from "@open-wc/lit-helpers";
import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import type {
  BoxAlignItems,
  BoxGap,
  BoxGrid,
  BoxJustifyContent,
  BoxPadding,
} from "../box/types.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { PASS_THROUGH_LINK_PROPS } from "../link/constants.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./card-styles.js";
import type { CardProperties, CardShape, CardVariant } from "./types.js";

const BaseCard = InteractionMixin(PaletteMixin(MarginMixin(LitElement)), true);

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
export class Card extends BaseCard implements CardProperties {
  static override styles = [...BaseCard.styles, styles];
  static override shadowRootOptions: ShadowRootInit = {
    ...BaseCard.shadowRootOptions,
    delegatesFocus: true,
  };
  static readonly elementName: string = "mwc-card";

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

  @property({ type: Boolean })
  clickable = false;

  @property({ type: Boolean })
  dragging = false;

  // link properties
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

  @property()
  type?: string;

  override render(): TemplateResult {
    if (this.href) {
      return this.#renderLink();
    }

    if (this.clickable) {
      return this.#renderButton();
    }

    return this.#renderBox();
  }

  #renderBox(): TemplateResult {
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

  #renderLink(): TemplateResult {
    const props: Partial<HTMLAnchorElement> = {};
    for (const name of PASS_THROUGH_LINK_PROPS) {
      props[name] = this[name];
    }

    return html`
      <a
        ${spread(props)}
        class="state-layer-target"
        @focus=${this._updateFocusVisible}
        @blur=${this._updateFocusVisible}
      >
        ${this.#renderBox()}${this._renderStateLayer()}
      </a>
    `;
  }

  #renderButton(): TemplateResult {
    let tabIndex = 0;
    let ariaDisabled: "true" | undefined;
    if (this.disabled) {
      ariaDisabled = "true";
      tabIndex = -1;
    }

    return html`
      <div
        aria-disabled=${ifDefined(ariaDisabled)}
        role="button"
        class="state-layer-target"
        tabindex=${tabIndex}
        @click=${this.#handleButtonClick}
        @keydown=${this.#handleButtonKeyDown}
        @focus=${this._updateFocusVisible}
        @blur=${this._updateFocusVisible}
      >
        ${this.#renderBox()}${this._renderStateLayer()}
      </div>
    `;
  }

  #handleButtonClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  #handleButtonKeyDown(event: KeyboardEvent): void {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    // do not scroll the page
    if (event.key === " ") {
      event.preventDefault();
    }

    // since I won't remember this, for some reason `this.click()` won't work
    // like how it did for React so a new event must be dispatched.
    this.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }
}
