import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./object-fit-styles.js";
import type { ObjectFitVariant } from "./types.js";

@customElement("mwc-object-fit")
export class ObjectFit extends LitElement {
  static override styles = styles;

  @property({ type: Boolean })
  inline = false;

  @property()
  variant: ObjectFitVariant = "contain";

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (!changed.has("variant")) {
      return;
    }

    const property = "--mwc-object-fit";
    this.style.setProperty(property, this.variant);
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-object-fit": ObjectFit;
  }
}
