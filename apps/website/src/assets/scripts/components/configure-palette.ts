import type { ColorScheme } from "@mlaursen/wc";
import {
  convertMaterialThemeToProperties,
  parseMaterialTheme,
} from "@mlaursen/wc/palette/utils";
import { spread } from "@open-wc/lit-helpers";
import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

import { materialThemeBuilderUrl } from "../../../packages/wc/wc.11tydata.js";
import materialTheme from "../../json/material-theme.json" with { type: "json" };

const colorSchemes: ColorScheme[] = ["light", "dark", "light-dark"];
const contrasts = ["normal", "medium", "high"] as const;

const defaultTheme = parseMaterialTheme(materialTheme);

const THEME_KEY = "theme";
const CONTRAST_KEY = "materialContrast";
const COLOR_SCHEME_KEY = "colorScheme";
const MATERIAL_THEME_KEY = "materialThemeEnabled";

type MaterialPaletteContrast = (typeof contrasts)[number];

function isValidColorScheme(
  colorScheme: string | null,
): colorScheme is ColorScheme {
  return colorSchemes.includes(colorScheme as ColorScheme);
}

function isValidContrast(
  contrast: string | null,
): contrast is MaterialPaletteContrast {
  return contrasts.includes(contrast as MaterialPaletteContrast);
}

@customElement("configure-palette")
export class ConfigurePalette extends LitElement {
  @state()
  contrast: MaterialPaletteContrast = "normal";

  @state()
  colorScheme: ColorScheme = "light-dark";

  @state()
  materialTheme = false;

  @state()
  theme = defaultTheme;

  override connectedCallback(): void {
    super.connectedCallback();

    const theme = localStorage.getItem(THEME_KEY);
    const contrast = localStorage.getItem(CONTRAST_KEY);
    const colorScheme = localStorage.getItem(COLOR_SCHEME_KEY);
    const materialTheme = localStorage.getItem(MATERIAL_THEME_KEY);
    if (theme) {
      try {
        this.theme = parseMaterialTheme(theme);
        this.materialTheme = true;
      } catch {
        localStorage.removeItem(THEME_KEY);
      }
    }

    if (isValidColorScheme(colorScheme)) {
      this.colorScheme = colorScheme;
    } else {
      localStorage.removeItem(COLOR_SCHEME_KEY);
    }

    if (isValidContrast(contrast)) {
      this.contrast = contrast;
    } else {
      localStorage.removeItem(CONTRAST_KEY);
    }

    if (materialTheme === "true" || materialTheme === "false") {
      this.materialTheme = materialTheme === "true";
    } else {
      localStorage.removeItem(MATERIAL_THEME_KEY);
    }
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("theme")) {
      if (this.theme === defaultTheme) {
        localStorage.removeItem(THEME_KEY);
      } else {
        localStorage.setItem(THEME_KEY, JSON.stringify(this.theme));
      }
    }

    if (changed.has("contrast")) {
      localStorage.setItem(CONTRAST_KEY, this.contrast);
    }

    if (changed.has("materialTheme")) {
      localStorage.setItem(MATERIAL_THEME_KEY, `${this.materialTheme}`);
    }

    if (changed.has("colorScheme")) {
      localStorage.setItem(COLOR_SCHEME_KEY, this.colorScheme);
    }
  }

  override render(): TemplateResult {
    const theme = convertMaterialThemeToProperties({
      schemes: this.theme.schemes,
      contrast: this.contrast,
      colorScheme: this.materialTheme && this.colorScheme,
    });

    return html`
      <mwc-box stacked padding="none" align="start">
        <mwc-update-palette
          root
          color-scheme=${this.colorScheme}
          ${spread(theme)}
        ></mwc-update-palette>
        ${this.#renderColorScheme()} ${this.#renderMaterialColors()}
        ${this.#renderCustomTheme()}
      </mwc-box>
    `;
  }

  #renderColorScheme(): TemplateResult {
    return html`
      <mwc-typography variant="title" size="small">Color Scheme</mwc-typography>
      <mwc-box>
        ${map(colorSchemes, (colorScheme) => {
          const active = this.colorScheme === colorScheme;
          return html`
            <mwc-button
              variant=${active ? "filled" : "outlined"}
              @click=${() => this.#changeColorScheme(colorScheme)}
            >
              ${colorScheme}
            </mwc-button>
          `;
        })}
      </mwc-box>
    `;
  }

  #renderMaterialColors(): TemplateResult {
    return html`
      <mwc-typography variant="title" size="medium"
        >Material Colors</mwc-typography
      >
      <mwc-box>
        ${map(contrasts, (contrast) => {
          const active = this.materialTheme && this.contrast === contrast;
          return html`
            <mwc-button
              variant=${active ? "filled" : "outlined"}
              @click=${() => this.#changeMaterialColor(contrast)}
            >
              ${contrast}
            </mwc-button>
          `;
        })}
      </mwc-box>
    `;
  }

  #renderCustomTheme(): TemplateResult {
    return html`
      <mwc-divider></mwc-divider>
      <mwc-typography variant="title" size="medium"
        >Custom Theme</mwc-typography
      >
      <mwc-link href=${materialThemeBuilderUrl} target="_blank"
        >Material Theme Builder</mwc-link
      >
      ${(this.theme !== defaultTheme &&
        html`
          <mwc-typography><h3>Seed: ${this.theme.seed}</h3></mwc-typography>
          <mwc-button
            @click=${() => {
              this.theme = defaultTheme;
              this.contrast = "normal";
              this.materialTheme = false;
            }}
          >
            Remove Custom Theme
          </mwc-button>
        `) ||
      nothing}
      <mwc-button aria-label="Upload Material Theme">
        <mwc-material-symbol>upload</mwc-material-symbol>
        <input type="file" @change=${this.#handleFileUpload} accept=".json" />
      </mwc-button>
    `;
  }

  async #handleFileUpload(event: InputEvent): Promise<void> {
    if (
      !(event.currentTarget instanceof HTMLInputElement) ||
      !event.currentTarget.files
    ) {
      return;
    }

    const { files } = event.currentTarget;
    for (const file of files) {
      const contents = await file.text();
      this.theme = parseMaterialTheme(contents);
      this.materialTheme = true;
    }
  }

  #changeMaterialColor(contrast: MaterialPaletteContrast): void {
    if (this.materialTheme && this.contrast === contrast) {
      this.materialTheme = false;
      return;
    }

    this.materialTheme = true;
    this.contrast = contrast;
  }

  #changeColorScheme(colorScheme: ColorScheme): void {
    this.colorScheme = colorScheme;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "configure-palette": ConfigurePalette;
  }
}
