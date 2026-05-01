import { LitElement, type TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";

import {
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from "../src/button/types.js";
import type { IconButtonWidth } from "../src/icon-button/types.js";

const sizes: ButtonSize[] = [
  "extra-small",
  "small",
  "medium",
  "large",
  "extra-large",
];
const variants: ButtonVariant[] = [
  "filled",
  "outlined",
  "text",
  "tonal",
  "elevated",
];
const shapes: ButtonShape[] = ["round", "square"];
const widths: (IconButtonWidth | undefined)[] = [undefined, "narrow", "wide"];

@customElement("icon-buttons")
export class Buttons extends LitElement {
  @state()
  _visible = true;

  _renderEverything(): TemplateResult | null {
    if (!this._visible) {
      return null;
    }

    return html`
      ${map(
        sizes,
        (size) => html`
          <ui-box justify="space-evenly" full-width>
            ${map(
              widths,
              (width) => html`
                <ui-icon-button size=${size} width=${ifDefined(width)}>
                  <material-symbol>edit</material-symbol>
                </ui-icon-button>
              `,
            )}
          </ui-box>
        `,
      )}
    `;
  }

  override render(): TemplateResult | null {
    if (this.hidden) {
      return null;
    }

    return html`
      <ui-box stacked align="start">
        <ui-typography variant="display" margin="top">
          <h3>Icon Buttons</h3>
        </ui-typography>
        <ui-box>
          <ui-button
            @click=${() => {
              this._visible = !this._visible;
            }}
          >
            ${this._visible ? "Hide" : "Show"}
          </ui-button>
        </ui-box>
        ${this._renderEverything()}
      </ui-box>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "icon-buttons": Buttons;
  }
}
