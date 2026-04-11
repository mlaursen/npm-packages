import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import "../src/index.js";
import lightDarkStyles from "../src/palette/light-dark-styles.js";
import "./material-symbols.js";
import "./typography.js";

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(lightDarkStyles.cssText);
document.adoptedStyleSheets.push(stylesheet);

@customElement("mwc-main")
export class Main extends LitElement {
  override render(): TemplateResult {
    return html`
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
