import { type ReactiveController, type ReactiveControllerHost } from "lit";

import type {
  MediaQueryControllerOptions,
  MediaQueryNameOrQuery,
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
  #media: MediaQueryList | null = null;
  readonly #host: ReactiveControllerHost;
  readonly #getNamedQueries: () => NamedMediaQueries;
  #connected = false;

  /**
   * The available named queries for the
   */
  static getNamedQueries(): NamedMediaQueries {
    return getDefaultNamedMediaQueries();
  }

  constructor(options: MediaQueryControllerOptions) {
    const { host, query, getNamedQueries } = options;

    this.#host = host;
    this.#getNamedQueries =
      getNamedQueries ?? MediaQueryController.getNamedQueries;
    this.#media = createMediaQuery(query, this.#getNamedQueries);

    host.addController(this);
  }

  hostConnected(): void {
    this.#connected = true;
    this.#subscribe();
  }

  hostDisconnected(): void {
    this.#connected = false;
    this.#unsubscribe();
  }

  setQuery(query: MediaQueryNameOrQuery | null): void {
    this.#unsubscribe();
    this.#media = createMediaQuery(query, this.#getNamedQueries);
    if (this.#connected) {
      this.#subscribe();
    }

    this.#host.requestUpdate();
  }

  get matches(): boolean {
    return this.#media?.matches ?? false;
  }

  #emit = (): void => {
    this.#host.requestUpdate();
  };

  #subscribe(): void {
    this.#media?.addEventListener("change", this.#emit);
  }

  #unsubscribe(): void {
    this.#media?.removeEventListener("change", this.#emit);
  }
}
