import type { TemplateResult } from "lit";
import { html } from "lit";

import { Box } from "../box/box.js";
import { isSlotted } from "../utils/slots.js";
import styles from "./dialog-header-styles.js";

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
