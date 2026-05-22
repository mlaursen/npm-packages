import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "./text-container-styles.js";

@customElement("mwc-text-container")
export class TextContainer extends LitElement {
  static override styles = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-text-container": TextContainer;
  }
}
