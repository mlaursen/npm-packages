import { spread } from "@open-wc/lit-helpers";
import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import buttonStyles from "../button/button-styles.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./link-styles.js";
import {
  type LinkProperties,
  type PassThroughLinkProperties,
} from "./types.js";

const BaseLink = PaletteMixin(MarginMixin(LitElement));

const PASS_THROUGH_PROPS = [
  "rel",
  "href",
  "hreflang",
  "target",
  "download",
  "ping",
  "type",
  "referrerPolicy",
] satisfies readonly (keyof PassThroughLinkProperties)[];
type Props = Partial<
  Record<keyof PassThroughLinkProperties, string | undefined>
>;

@customElement("mwc-link")
export class Link extends BaseLink implements LinkProperties {
  static override styles = [...BaseLink.styles, styles];
  shadowRootOptions: ShadowRootInit = {
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

  protected override render(): TemplateResult {
    const props: Props = {};
    for (const name of PASS_THROUGH_PROPS) {
      props[name] = this[name];
    }

    return html`<a ${spread(props)}><slot></slot></a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-link": Link;
  }
}
