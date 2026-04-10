import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import "../dist/index.js";
import lightDarkStyles from "../dist/palette/light-dark-styles.js";
import "./typography.js";

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(lightDarkStyles.cssText);
document.adoptedStyleSheets.push(stylesheet);

@customElement("mwc-main")
export class Main extends LitElement {
  override render(): TemplateResult {
    return html`<app-typography></app-typography>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-main": Main;
  }
}
