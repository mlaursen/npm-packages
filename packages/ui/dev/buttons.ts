import { LitElement, type TemplateResult, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import {
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from "../src/button/types.js";

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

@customElement("app-buttons")
export class Buttons extends LitElement {
  static override styles = css`
    .container {
      overflow: auto;
      width: 100%;
    }
    table {
      border-spacing: 0;
      max-width: 100%;
    }
    td,
    th {
      height: 3.25rem;
      padding: 0.375rem 1rem;
      text-align: left;
      white-space: nowrap;
    }
  `;

  @state()
  _visible = true;

  _renderEverything(): TemplateResult | null {
    if (!this._visible) {
      return null;
    }

    return html`${variants.map((variant) =>
      shapes.map(
        (shape) => html`
          <ui-typography
            margin="top"
            variant="headline"
            text-transform="capitalize"
          >
            ${variant} ${shape}
          </ui-typography>
          <ui-box class="container">
            <table>
              <thead>
                <tr>
                  <td></td>
                  <th><ui-typography>Labelled</ui-typography></th>
                  <th><ui-typography>Leading Icon</ui-typography></th>
                  <th><ui-typography>Trailing Icon</ui-typography></th>
                  <th><ui-typography>Disabled Labelled</ui-typography></th>
                  <th><ui-typography>Disabled Leading Icon</ui-typography></th>
                  <th><ui-typography>Disabled Trailing Icon</ui-typography></th>
                </tr>
              </thead>
              <tbody>
                ${sizes.map(
                  (size) => html`
                    <tr>
                      <th scope="row">
                        <ui-typography>${size}</ui-typography>
                      </th>
                      <td>
                        <ui-button
                          size=${size}
                          variant=${variant}
                          shape=${shape}
                        >
                          Label text
                        </ui-button>
                      </td>
                      <td>
                        <ui-button
                          size=${size}
                          variant=${variant}
                          shape=${shape}
                        >
                          <material-symbol>favorite</material-symbol>
                          Label text
                        </ui-button>
                      </td>
                      <td>
                        <ui-button
                          size=${size}
                          variant=${variant}
                          shape=${shape}
                        >
                          Label text
                          <material-symbol>favorite</material-symbol>
                        </ui-button>
                      </td>
                      <td>
                        <ui-button
                          size=${size}
                          variant=${variant}
                          shape=${shape}
                          disabled
                        >
                          Disabled
                        </ui-button>
                      </td>
                      <td>
                        <ui-button
                          size=${size}
                          variant=${variant}
                          shape=${shape}
                          disabled
                        >
                          <material-symbol>favorite</material-symbol>
                          Label text
                        </ui-button>
                      </td>
                      <td>
                        <ui-button
                          size=${size}
                          variant=${variant}
                          shape=${shape}
                          disabled
                        >
                          Label text
                          <material-symbol>favorite</material-symbol>
                        </ui-button>
                      </td>
                    </tr>
                  `,
                )}
                <tr></tr>
              </tbody>
            </table>
          </ui-box>
        `,
      ),
    )}`;
  }

  override render(): TemplateResult {
    return html`
      <ui-box stacked align="start">
        <ui-typography variant="display" margin="top">
          <h3>Buttons</h3>
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
        <ui-button aria-label="Hello!">
          <material-symbol>favorite</material-symbol>
        </ui-button>
      </ui-box>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-buttons": Buttons;
  }
}
