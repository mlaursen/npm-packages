import type { PropertyValues } from "lit";
import { html } from "lit";
import { property } from "lit/decorators.js";

import { Icon } from "../icon/icon.js";
import styles from "./material-symbol-styles.js";
import type {
  MaterialSymbolCustomPropertyName,
  MaterialSymbolFamily,
  MaterialSymbolFill,
  MaterialSymbolGrade,
  MaterialSymbolOpticalSize,
  MaterialSymbolProperties,
  MaterialSymbolWeight,
} from "./types.js";
import { toggleMaterialSymbolVar } from "./utils.js";

const LIVE_STYLE_PROPERTIES = [
  "fill",
  "weight",
  "grade",
  "opsz",
  "family",
] as const satisfies MaterialSymbolCustomPropertyName[];

/**
 * @slot - The default content slot that should just be the name of one of the
 * valid material symbols.
 */
export class MaterialSymbol extends Icon implements MaterialSymbolProperties {
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

  #managed = new Set<MaterialSymbolCustomPropertyName>();

  protected override render(): unknown {
    return html`<slot></slot>`;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    for (const property of LIVE_STYLE_PROPERTIES) {
      this.#updateProperty(property);
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    for (const property of LIVE_STYLE_PROPERTIES) {
      if (changed.has(property)) {
        this.#updateProperty(property);
      }
    }
  }

  #updateProperty(name: MaterialSymbolCustomPropertyName): void {
    const value = this[name];
    const isNullOrUndefined = value === null || value === undefined;
    if (isNullOrUndefined && !this.#managed.has(name)) {
      return;
    }

    if (isNullOrUndefined) {
      this.#managed.delete(name);
    } else {
      this.#managed.add(name);
    }

    toggleMaterialSymbolVar({
      root: this,
      name,
      value,
    });
  }
}
