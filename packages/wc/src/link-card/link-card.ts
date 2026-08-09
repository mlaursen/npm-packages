import { spread } from "@open-wc/lit-helpers";
import { type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Card } from "../card/card.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { PASS_THROUGH_LINK_PROPS } from "../link/constants.js";
import styles from "./link-card-styles.js";

const BaseLinkCard = InteractionMixin(Card, true);

@customElement("mwc-link-card")
export class LinkCard extends BaseLinkCard {
  static override styles = [...BaseLinkCard.styles, styles];
  static override shadowRootOptions: ShadowRootInit = {
    ...BaseLinkCard.shadowRootOptions,
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

  @property({ type: Boolean, reflect: true })
  clickable = true;

  @property({ type: Boolean })
  dragging = false;

  override render(): TemplateResult {
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
        ${super.render()} ${this._renderStateLayer()} ${this._renderRipple()}
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-link-card": LinkCard;
  }
}
