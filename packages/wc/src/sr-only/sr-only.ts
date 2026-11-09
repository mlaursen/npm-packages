import {
  LitElement,
  html,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property } from "lit/decorators.js";

import { MediaQueryController } from "../media-queries/media-query-controller.js";
import type { MediaQueryNameOrQuery } from "../media-queries/types.js";
import styles from "./sr-only-styles.js";
import type { SrOnlyProperties } from "./types.js";

/**
 * This element allows for screen-reader only visible content to be displayed
 * which is helpful for accessibility.
 */
export class SrOnly extends LitElement implements SrOnlyProperties {
  static override styles = styles;
  static readonly elementName: string = "mwc-sr-only";

  @property({ type: Boolean, reflect: true })
  active = true;

  @property({ attribute: "active-media" })
  activeMedia: MediaQueryNameOrQuery | null = null;

  @property({ type: Boolean, reflect: true })
  focusable = false;

  #activeMedia = new MediaQueryController({
    host: this,
    query: this.activeMedia,
  });
  #beforeSetMedia = this.active;

  protected override willUpdate(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("active")) {
      this.#beforeSetMedia = this.active;
    }

    if (changed.has("activeMedia")) {
      this.#activeMedia.setQuery(this.activeMedia);
    }

    this.active = this.activeMedia
      ? this.#activeMedia.matches
      : this.#beforeSetMedia;
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
