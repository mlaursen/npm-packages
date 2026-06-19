import { spread } from "@open-wc/lit-helpers";
import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import { PASS_THROUGH_LINK_PROPS } from "./constants.js";
import styles from "./link-styles.js";
import { type LinkProperties } from "./types.js";

const BaseLink = InteractionMixin(PaletteMixin(MarginMixin(LitElement)), true);

@customElement("mwc-link")
export class Link extends BaseLink implements LinkProperties {
  static override styles = [...BaseLink.styles, styles];
  static override shadowRootOptions: ShadowRootInit = {
    ...BaseLink.shadowRootOptions,
    delegatesFocus: true,
  };

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

  @property({ type: Boolean })
  override disableRipple = true;

  @property({ type: Boolean })
  inline?: boolean;

  protected override render(): TemplateResult {
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
        <slot></slot>
        ${this._renderStateLayer()}
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-link": Link;
  }
}
