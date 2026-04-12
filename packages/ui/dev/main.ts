import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import "../src/index.js";
import lightDarkStyles from "../src/palette/light-dark-styles.js";
import "./buttons.js";
import "./color-scheme.js";
import "./form-test.js";
import "./material-symbols.js";
import "./typography.js";

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(lightDarkStyles.cssText);
document.adoptedStyleSheets.push(stylesheet);

@customElement("mwc-main")
export class Main extends LitElement {
  override render(): TemplateResult {
    return html`
      <color-scheme></color-scheme>
      <ui-form-test>
        <ui-button slot="submit" type="reset">Reset</ui-button>
      </ui-form-test>
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
