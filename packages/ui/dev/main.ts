import { LitElement, type TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import cssResetStyles from "../src/css-reset/css-reset-styles.js";
import "../src/index.js";
import lightDarkStyles from "../src/palette/light-dark-styles.js";
import "./buttons.js";
import "./change-color.js";
import "./form-test.js";
import "./material-symbols.js";
import "./toggle-dir.js";
import "./tooltips.js";
import "./typography.js";

for (const styles of [lightDarkStyles, cssResetStyles]) {
  const stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(styles.cssText);
  document.adoptedStyleSheets.push(stylesheet);
}

@customElement("mwc-main")
export class Main extends LitElement {
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  @state()
  visible = new Set<string>([
    // "toggle-dir",
    // "form-test",
    // "buttons",
    // "material-symbols",
    // "typography",
    "tooltips",
  ]);

  override render(): TemplateResult {
    return html`
      <change-color no-config>
        <toggle-dir .hidden=${!this.visible.has("toggle-dir")}></toggle-dir>
        <form-test .hidden=${!this.visible.has("form-test")}></form-test>
        <app-buttons .hidden=${!this.visible.has("buttons")}></app-buttons>
        <app-material-symbols
          .hidden=${!this.visible.has("material-symbols")}
        ></app-material-symbols>
        <app-typography
          .hidden=${!this.visible.has("typography")}
        ></app-typography>
        <app-tooltips .hidden=${!this.visible.has("tooltips")}></app-tooltips>
      </change-color>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-main": Main;
  }
}
