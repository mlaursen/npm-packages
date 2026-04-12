import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing,
} from "lit";
import { customElement, state } from "lit/decorators.js";

import type { ColorScheme } from "../src/palette/types.js";

const schemes: ColorScheme[] = ["light", "dark", "light-dark"];
// const schemes: ColorScheme[] = ["light", "dark", "system", "light-dark"];

@customElement("color-scheme")
export class ColorSchemeElement extends LitElement {
  @state()
  colorScheme: ColorScheme = "light-dark";

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    const colorScheme = changed.get("colorScheme");
    if (!schemes.includes(colorScheme)) {
      return;
    }

    document.documentElement.style.colorScheme = this.colorScheme;
  }

  override render(): TemplateResult {
    return html`
      <ui-box>
        ${schemes.map(
          (scheme) => html`
            <ui-button
              variant=${this.colorScheme === scheme ? "filled" : "outlined"}
              @click=${() => {
                this.colorScheme = scheme;
              }}
              .disabled=${this.colorScheme === scheme}
            >
              ${scheme}
            </ui-button>
          `,
        )}
      </ui-box>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "color-scheme": ColorSchemeElement;
  }
}
