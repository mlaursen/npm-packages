import type { ReactiveController, ReactiveControllerHost } from "lit";

import type {
  MediaQueryControllerOptions,
  NamedMediaQueries,
} from "./types.js";
import { createMediaQuery, getDefaultNamedMediaQueries } from "./utils.js";

/**
 * This controller allows for the host element to react/re-render to media
 * query events so that new properties can be set within the template.
 *
 * @example Simple Example
```ts
import { MediaQueryController } from "@mlaursen/wc";
import type { , TemplateResult } from "lit";
import { css, html, LitElement } from "lit";
import { styleMap } from "lit/directives/style-map.js";

export class MyExample extends LitElement {
  #phoneMedia = new MediaQueryController({ host: this, query: "phone" });
  #customMedia = new MediaQueryController({ host: this, query: "(min-width: 1200px)"});

  override render(): TemplateResult {
    const backdrop = this.#phoneMedia.matches ? "visible" : "disabled";
    return html`
      <mwc-sheet
        style="${styleMap({ background: this.#customMedia.matches ? "red" : "blue" })}"
        type="fixed"
        position="left"
        backdrop=${backdrop}
        disable-focus-trap=${!this.#phoneMedia.matches}
        disable-scroll-lock
        close-button
      >
        Content...
      </mwc-sheet>
    `
  }
}
```
 *
 */
export class MediaQueryController implements ReactiveController {
  #media: MediaQueryList;
  #host: ReactiveControllerHost;

  /**
   * The available named queries for the
   */
  static getNamedQueries(): NamedMediaQueries {
    return getDefaultNamedMediaQueries();
  }

  constructor(options: MediaQueryControllerOptions) {
    const { host, query, getNamedQueries } = options;
    this.#host = host;
    this.#media = createMediaQuery(
      query,
      getNamedQueries ?? MediaQueryController.getNamedQueries,
    );

    host.addController(this);
  }

  hostConnected(): void {
    this.#media.addEventListener("change", this.#emit);
  }

  hostDisconnected(): void {
    this.#media.removeEventListener("change", this.#emit);
  }

  get matches(): boolean {
    return this.#media.matches;
  }

  #emit = (): void => {
    this.#host.requestUpdate();
  };
}
