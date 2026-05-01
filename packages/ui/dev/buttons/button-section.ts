import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./button-section-styles.js";

@customElement("button-section")
export class ButtonSection extends LitElement {
  static override styles = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "button-section": ButtonSection;
  }
}
