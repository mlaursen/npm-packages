import { kebabCase, upperFirst } from "@mlaursen/utils";
import { spread } from "@open-wc/lit-helpers";
import { LitElement, type TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";

import type { ColorScheme } from "../src/palette/types.js";
import palette from "./palette.json" with { type: "json" };

const { schemes } = palette;

const modes = ["light", "dark", "both", "none"] as const;
const contrasts = ["normal", "medium", "high"] as const;
const colorSchemes: ColorScheme[] = ["light", "dark", "light-dark"];
const roots = ["none", "color-scheme", "all"] as const;
type ColorMode = (typeof modes)[number];
type Contrast = (typeof contrasts)[number];
type RootMode = (typeof roots)[number];

@customElement("change-color")
export class ChangeColor extends LitElement {
  @state()
  _mode: ColorMode = "none";

  @state()
  _contrast: Contrast = "normal";

  @state()
  _colorScheme: ColorScheme = "light-dark";

  @state()
  _root: RootMode = "none";

  override render(): TemplateResult {
    let rootColorScheme: ColorScheme | undefined;
    let localColorScheme: ColorScheme | undefined;
    if (this._root === "all" || this._root === "none") {
      localColorScheme = this._colorScheme;
    } else {
      rootColorScheme = this._colorScheme;
    }

    return html`
      <ui-update-palette
        .root=${this._root === "all"}
        color-scheme=${ifDefined(localColorScheme)}
        ${spread(this.#getProperties())}
      >
        <ui-update-palette root color-scheme=${ifDefined(rootColorScheme)}>
          <ui-box stacked>
            <ui-typography variant="display">
              <h2>Change Color</h2>
            </ui-typography>
            <ui-typography variant="title">Material Colors</ui-typography>
            <ui-box>
              ${map(modes, (mode) => {
                const active = this._mode === mode;
                return html`
                  <ui-button
                    variant=${active ? "filled" : "outlined"}
                    @click=${() => this.#changeMode(mode)}
                    .disabled=${active}
                  >
                    ${mode}
                  </ui-button>
                `;
              })}
            </ui-box>
            <ui-typography variant="title">Contrast</ui-typography>
            <ui-box>
              ${map(contrasts, (contrast) => {
                const active = this._contrast === contrast;
                return html`
                  <ui-button
                    variant=${active ? "filled" : "outlined"}
                    @click=${() => this.#changeContrast(contrast)}
                    .disabled=${active}
                  >
                    ${contrast}
                  </ui-button>
                `;
              })}
            </ui-box>
            <ui-typography variant="title">Color Schemes</ui-typography>
            <ui-box>
              ${map(colorSchemes, (colorScheme) => {
                const active = this._colorScheme === colorScheme;
                return html`
                  <ui-button
                    variant=${active ? "filled" : "outlined"}
                    @click=${() => {
                      this._colorScheme = colorScheme;
                    }}
                    .disabled=${active}
                  >
                    ${colorScheme}
                  </ui-button>
                `;
              })}
            </ui-box>
            <ui-typography variant="title">Root</ui-typography>
            <ui-box>
              ${map(roots, (root) => {
                const active = root === this._root;
                return html`
                  <ui-button
                    variant=${active ? "filled" : "outlined"}
                    @click=${() => {
                      this._root = root;
                    }}
                    .disabled=${active}
                  >
                    ${root}
                  </ui-button>
                `;
              })}
            </ui-box>
          </ui-box>
          <slot></slot>
        </ui-update-palette>
      </ui-update-palette>
    `;
  }

  #changeMode(mode: ColorMode): void {
    this._mode = mode;
  }

  #changeContrast(contrast: Contrast): void {
    this._contrast = contrast;
  }

  #getProperties(): Record<string, string | undefined> {
    let lightScheme: (typeof schemes)["light"];
    let darkScheme: (typeof schemes)["dark"];
    if (this._contrast === "normal") {
      lightScheme = schemes.light;
      darkScheme = schemes.dark;
    } else {
      lightScheme = schemes[`light-${this._contrast}-contrast`];
      darkScheme = schemes[`dark-${this._contrast}-contrast`];
    }

    const properties: Record<string, string | undefined> = {};
    for (const [name, value] of Object.entries(lightScheme)) {
      let key = name;
      let undefinedKey = `light${upperFirst(name)}`;
      if (this._mode === "both") {
        [key, undefinedKey] = [undefinedKey, key];
      }

      properties[kebabCase(key)] =
        this._mode === "light" || this._mode === "both" ? value : undefined;
      properties[kebabCase(undefinedKey)] = undefined;
    }

    for (const [name, value] of Object.entries(darkScheme)) {
      if (this._mode === "both") {
        properties[kebabCase(`dark${upperFirst(name)}`)] = value;
      } else if (this._mode === "dark") {
        properties[kebabCase(name)] = value;
      } else {
        properties[kebabCase(`dark${upperFirst(name)}`)] = undefined;
      }
    }

    return properties;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "change-color": ChangeColor;
  }
}
