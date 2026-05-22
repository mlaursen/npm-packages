import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./divider-styles.js";
import { type DividerVariant } from "./types.js";

@customElement("mwc-divider")
export class Divider extends LitElement {
  static override styles = styles;

  @property()
  size?: string;

  @property()
  stretch?: string;

  @property({ reflect: true })
  override role: string = "separator";

  @property({ attribute: "aria-orientation", reflect: true })
  override ariaOrientation: string = "horizontal";

  @property({ reflect: true })
  variant: DividerVariant = "full-width";

  #updateProperties(): void {
    const properties = ["size", "stretch"] as const;
    for (const property of properties) {
      const varName = `--mwc-${property}`;
      const value = this[property];
      if (typeof value === "string" && value.length > 0) {
        this.style.setProperty(varName, value);
      } else {
        this.style.removeProperty(varName);
      }
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#updateProperties();
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("size") || changed.has("stretch")) {
      this.#updateProperties();
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-divider": Divider;
  }
}
