import { camelCase } from "@mlaursen/utils";
import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property } from "lit/decorators.js";

import { UI_CONFIG } from "../config.js";
import { contrastColor } from "../utils/luminance.js";
import {
  type AllPaletteTokenName,
  type CamelCaseContainerColor,
  type ColorScheme,
  type PaletteTokenProperties,
} from "./types.js";
import styles from "./update-palette-styles.js";
import {
  getContainerVar,
  getOnContainerProperty,
  getOnContainerVar,
  getRemainingVar,
  isPaletteContainerProperty,
  isRemainingPaletteProperty,
} from "./utils.js";

@customElement("ui-update-palette")
export class UpdatePalette
  extends LitElement
  implements PaletteTokenProperties
{
  static override styles = styles;

  @property({ type: Boolean })
  root = false;

  @property({ attribute: "color-scheme" })
  colorScheme?: ColorScheme;

  // NOTE: Keep same order as scss tokens

  @property()
  primary?: string;
  @property({ attribute: "light-primary" })
  lightPrimary?: string;
  @property({ attribute: "dark-primary" })
  darkPrimary?: string;

  @property({ attribute: "primary-container" })
  primaryContainer?: string;
  @property({ attribute: "light-primary-container" })
  lightPrimaryContainer?: string;
  @property({ attribute: "dark-primary-container" })
  darkPrimaryContainer?: string;

  @property({ attribute: "on-primary" })
  onPrimary?: string;
  @property({ attribute: "light-on-primary" })
  lightOnPrimary?: string;
  @property({ attribute: "dark-on-primary" })
  darkOnPrimary?: string;

  @property({ attribute: "on-primary-container" })
  onPrimaryContainer?: string;
  @property({ attribute: "light-on-primary-container" })
  lightOnPrimaryContainer?: string;
  @property({ attribute: "dark-on-primary-container" })
  darkOnPrimaryContainer?: string;

  @property({ attribute: "inverse-primary" })
  inversePrimary?: string;
  @property({ attribute: "light-inverse-primary" })
  lightInversePrimary?: string;
  @property({ attribute: "dark-inverse-primary" })
  darkInversePrimary?: string;

  @property()
  secondary?: string;
  @property({ attribute: "light-secondary" })
  lightSecondary?: string;
  @property({ attribute: "dark-secondary" })
  darkSecondary?: string;

  @property({ attribute: "secondary-container" })
  secondaryContainer?: string;
  @property({ attribute: "light-secondary-container" })
  lightSecondaryContainer?: string;
  @property({ attribute: "dark-secondary-container" })
  darkSecondaryContainer?: string;

  @property({ attribute: "on-secondary" })
  onSecondary?: string;
  @property({ attribute: "light-on-secondary" })
  lightOnSecondary?: string;
  @property({ attribute: "dark-on-secondary" })
  darkOnSecondary?: string;

  @property({ attribute: "on-secondary-container" })
  onSecondaryContainer?: string;
  @property({ attribute: "light-on-secondary-container" })
  lightOnSecondaryContainer?: string;
  @property({ attribute: "dark-on-secondary-container" })
  darkOnSecondaryContainer?: string;

  @property()
  tertiary?: string;
  @property({ attribute: "light-tertiary" })
  lightTertiary?: string;
  @property({ attribute: "dark-tertiary" })
  darkTertiary?: string;

  @property({ attribute: "tertiary-container" })
  tertiaryContainer?: string;
  @property({ attribute: "light-tertiary-container" })
  lightTertiaryContainer?: string;
  @property({ attribute: "dark-tertiary-container" })
  darkTertiaryContainer?: string;

  @property({ attribute: "on-tertiary" })
  onTertiary?: string;
  @property({ attribute: "light-on-tertiary" })
  lightOnTertiary?: string;
  @property({ attribute: "dark-on-tertiary" })
  darkOnTertiary?: string;

  @property({ attribute: "on-tertiary-container" })
  onTertiaryContainer?: string;
  @property({ attribute: "light-on-tertiary-container" })
  lightOnTertiaryContainer?: string;
  @property({ attribute: "dark-on-tertiary-container" })
  darkOnTertiaryContainer?: string;

  @property()
  surface?: string;
  @property({ attribute: "light-surface" })
  lightSurface?: string;
  @property({ attribute: "dark-surface" })
  darkSurface?: string;

  @property({ attribute: "surface-dim" })
  surfaceDim?: string;
  @property({ attribute: "light-surface-dim" })
  lightSurfaceDim?: string;
  @property({ attribute: "dark-surface-dim" })
  darkSurfaceDim?: string;

  @property({ attribute: "surface-bright" })
  surfaceBright?: string;
  @property({ attribute: "light-surface-bright" })
  lightSurfaceBright?: string;
  @property({ attribute: "dark-surface-bright" })
  darkSurfaceBright?: string;

  @property({ attribute: "surface-container-lowest" })
  surfaceContainerLowest?: string;
  @property({ attribute: "light-surface-container-lowest" })
  lightSurfaceContainerLowest?: string;
  @property({ attribute: "dark-surface-container-lowest" })
  darkSurfaceContainerLowest?: string;

  @property({ attribute: "surface-container-low" })
  surfaceContainerLow?: string;
  @property({ attribute: "light-surface-container-low" })
  lightSurfaceContainerLow?: string;
  @property({ attribute: "dark-surface-container-low" })
  darkSurfaceContainerLow?: string;

  @property({ attribute: "surface-container" })
  surfaceContainer?: string;
  @property({ attribute: "light-surface-container" })
  lightSurfaceContainer?: string;
  @property({ attribute: "dark-surface-container" })
  darkSurfaceContainer?: string;

  @property({ attribute: "surface-container-high" })
  surfaceContainerHigh?: string;
  @property({ attribute: "light-surface-container-high" })
  lightSurfaceContainerHigh?: string;
  @property({ attribute: "dark-surface-container-high" })
  darkSurfaceContainerHigh?: string;

  @property({ attribute: "surface-container-highest" })
  surfaceContainerHighest?: string;
  @property({ attribute: "light-surface-container-highest" })
  lightSurfaceContainerHighest?: string;
  @property({ attribute: "dark-surface-container-highest" })
  darkSurfaceContainerHighest?: string;

  @property({ attribute: "surface-variant" })
  surfaceVariant?: string;
  @property({ attribute: "light-surface-variant" })
  lightSurfaceVariant?: string;
  @property({ attribute: "dark-surface-variant" })
  darkSurfaceVariant?: string;

  @property({ attribute: "on-surface" })
  onSurface?: string;
  @property({ attribute: "light-on-surface" })
  lightOnSurface?: string;
  @property({ attribute: "dark-on-surface" })
  darkOnSurface?: string;

  @property({ attribute: "on-surface-variant" })
  onSurfaceVariant?: string;
  @property({ attribute: "light-on-surface-variant" })
  lightOnSurfaceVariant?: string;
  @property({ attribute: "dark-on-surface-variant" })
  darkOnSurfaceVariant?: string;

  @property({ attribute: "inverse-surface" })
  inverseSurface?: string;
  @property({ attribute: "light-inverse-surface" })
  lightInverseSurface?: string;
  @property({ attribute: "dark-inverse-surface" })
  darkInverseSurface?: string;

  @property({ attribute: "on-inverse-surface" })
  onInverseSurface?: string;
  @property({ attribute: "light-on-inverse-surface" })
  lightOnInverseSurface?: string;
  @property({ attribute: "dark-on-inverse-surface" })
  darkOnInverseSurface?: string;

  @property()
  background?: string;
  @property({ attribute: "light-background" })
  lightBackground?: string;
  @property({ attribute: "dark-background" })
  darkBackground?: string;

  @property({ attribute: "on-background" })
  onBackground?: string;
  @property({ attribute: "light-on-background" })
  lightOnBackground?: string;
  @property({ attribute: "dark-on-background" })
  darkOnBackground?: string;

  @property()
  error?: string;
  @property({ attribute: "light-error" })
  lightError?: string;
  @property({ attribute: "dark-error" })
  darkError?: string;

  @property({ attribute: "error-container" })
  errorContainer?: string;
  @property({ attribute: "light-error-container" })
  lightErrorContainer?: string;
  @property({ attribute: "dark-error-container" })
  darkErrorContainer?: string;

  @property({ attribute: "on-error" })
  onError?: string;
  @property({ attribute: "light-on-error" })
  lightOnError?: string;
  @property({ attribute: "dark-on-error" })
  darkOnError?: string;

  @property({ attribute: "on-error-container" })
  onErrorContainer?: string;
  @property({ attribute: "light-on-error-container" })
  lightOnErrorContainer?: string;
  @property({ attribute: "dark-on-error-container" })
  darkOnErrorContainer?: string;

  @property()
  outline?: string;
  @property({ attribute: "light-outline" })
  lightOutline?: string;
  @property({ attribute: "dark-outline" })
  darkOutline?: string;

  @property({ attribute: "outline-variant" })
  outlineVariant?: string;
  @property({ attribute: "light-outline-variant" })
  lightOutlineVariant?: string;
  @property({ attribute: "dark-outline-variant" })
  darkOutlineVariant?: string;

  @property()
  shadow?: string;
  @property({ attribute: "light-shadow" })
  lightShadow?: string;
  @property({ attribute: "dark-shadow" })
  darkShadow?: string;

  @property({ attribute: "surface-tint" })
  surfaceTint?: string;
  @property({ attribute: "light-surface-tint" })
  lightSurfaceTint?: string;
  @property({ attribute: "dark-surface-tint" })
  darkSurfaceTint?: string;

  @property()
  scrim?: string;
  @property({ attribute: "light-scrim" })
  lightScrim?: string;
  @property({ attribute: "dark-scrim" })
  darkScrim?: string;

  #autoOnColor = new Set<CamelCaseContainerColor>();
  #boundProperties = new Set<AllPaletteTokenName | "color-scheme">();

  #toggleProperty(
    name: AllPaletteTokenName | "color-scheme",
    value?: string | undefined,
  ): void {
    const style = (this.root ? document.documentElement : this).style;
    const varName = `${UI_CONFIG.varPrefix}${name}`;
    if (value) {
      style.setProperty(varName, value);
      this.#boundProperties.add(name);
    } else {
      style.removeProperty(varName);
      this.#boundProperties.delete(name);
    }
  }

  #updateContainerColor(name: CamelCaseContainerColor): void {
    const value = this[name];
    const varName = getContainerVar(name);
    const onName = getOnContainerProperty(name);
    const onVarName = getOnContainerVar(name);
    this.#toggleProperty(getContainerVar(name), value);
    if (value) {
      this.#toggleProperty(varName, value);

      const onColor = this[onName];
      if (!onColor) {
        this.#autoOnColor.add(name);
        this.#toggleProperty(onVarName, contrastColor(value));
      }
    } else {
      this.#toggleProperty(varName);
      if (this.#autoOnColor.has(name)) {
        this.#autoOnColor.delete(name);
        this.#toggleProperty(onVarName);
      }
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    const root = changed.get("root");
    if (
      changed.has("root") &&
      root !== undefined &&
      this.#boundProperties.size > 0
    ) {
      for (const property of this.#boundProperties) {
        const style = (this.root ? this : document.documentElement).style;
        style.removeProperty(`${UI_CONFIG.varPrefix}${property}`);

        this.#toggleProperty(property, this[camelCase(property)]);
      }
    }

    for (const [property, _value] of changed) {
      if (isPaletteContainerProperty(property)) {
        this.#updateContainerColor(property);
      } else if (isRemainingPaletteProperty(property)) {
        this.#toggleProperty(getRemainingVar(property), this[property]);
      } else if (property === "colorScheme") {
        this.#toggleProperty("color-scheme", this.colorScheme);
      }
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-update-palette": UpdatePalette;
  }
}
