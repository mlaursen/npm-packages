import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import cssResetStyles from "../src/css-reset/css-reset-styles.js";
import "../src/index.js";
import lightDarkStyles from "../src/palette/light-dark-styles.js";
import "./buttons.js";
import "./color-scheme.js";
import "./form-test.js";
import "./material-symbols.js";
import "./typography.js";

for (const styles of [lightDarkStyles, cssResetStyles]) {
  const stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(styles.cssText);
  document.adoptedStyleSheets.push(stylesheet);
}

@customElement("mwc-main")
export class Main extends LitElement {
  override render(): TemplateResult {
    return html`
      <color-scheme></color-scheme>
      <form-test></form-test>
      <app-buttons></app-buttons>
      <app-material-symbols></app-material-symbols>
      <app-typography></app-typography>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-main": Main;
  }
}
