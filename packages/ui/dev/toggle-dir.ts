import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

const dirs = ["ltr", "rtl"];

@customElement("toggle-dir")
export class ToggleDir extends LitElement {
  @state()
  _dir: string = "ltr";

  override render(): TemplateResult {
    return html`
      <ui-box stacked>
        <ui-typography><h2>Toggle Dir</h2></ui-typography>
        <ui-box>
          ${map(dirs, (dir) => {
            const active = this._dir === dir;
            return html`
              <ui-button @click=${() => this.#change(dir)} .disabled=${active}>
                ${dir}
              </ui-button>
            `;
          })}
        </ui-box>
      </ui-box>
    `;
  }

  #change(dir: string): void {
    this._dir = dir;
    if (dir === "ltr") {
      document.documentElement.removeAttribute("dir");
    } else {
      document.documentElement.dir = dir;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "toggle-dir": ToggleDir;
  }
}
