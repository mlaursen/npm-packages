import { type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import { Box } from "../box/box.js";
import { isSlotted } from "../utils/slots.js";
import styles from "./dialog-header-styles.js";

@customElement("mwc-dialog-header")
export class DialogHeader extends Box {
  static override styles = [...Box.styles, styles];

  override render(): TemplateResult {
    return html`
      <slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>
      <slot></slot>
    `;
  }

  #handleIconSlotChange(event: Event): void {
    this.stacked = isSlotted(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-header": DialogHeader;
  }
}
