import { type PropertyValues, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { UI_CONFIG } from "../config.js";
import { Icon } from "../icon/icon.js";
import styles from "./material-symbol-styles.js";
import {
  type MaterialSymbolFamily,
  type MaterialSymbolFill,
  type MaterialSymbolGrade,
  type MaterialSymbolOpticalSize,
  type MaterialSymbolWeight,
} from "./types.js";

const LIVE_STYLE_PROPERTIES = [
  "fill",
  "weight",
  "grade",
  "opsz",
  "family",
] as const;
type LiveStyleProperty = (typeof LIVE_STYLE_PROPERTIES)[number];

@customElement("material-symbol")
export class MaterialSymbol extends Icon {
  static override styles = [...Icon.styles, styles];

  @property()
  family?: MaterialSymbolFamily;

  @property({ type: Number })
  fill?: MaterialSymbolFill;

  @property({ type: Number })
  weight?: MaterialSymbolWeight;

  @property({ type: Number })
  grade?: MaterialSymbolGrade;

  @property({ type: Number })
  opsz?: MaterialSymbolOpticalSize;

  protected override render(): unknown {
    return html`<slot></slot>`;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    for (const property of LIVE_STYLE_PROPERTIES) {
      this.#updateProperty(property, true);
    }
  }
  protected override willUpdate(changed: PropertyValues): void {
    for (const property of LIVE_STYLE_PROPERTIES) {
      if (changed.has(property)) {
        this.#updateProperty(property);
      }
    }
  }

  #updateProperty(name: LiveStyleProperty, init = false): void {
    const varName = `${UI_CONFIG.varPrefix}icon-symbol-${name}`;
    const value = this[name];
    if (name === "family") {
      if (this.family) {
        const titleCase =
          this.family.slice(0, 1).toUpperCase() + this.family.slice(1);
        this.style.setProperty(varName, `Material Symbols ${titleCase}`);
      }
    } else if (value !== undefined) {
      this.style.setProperty(varName, `${value}`);
    }

    if (!init && !value) {
      this.style.removeProperty(varName);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "material-symbol": MaterialSymbol;
  }
}
