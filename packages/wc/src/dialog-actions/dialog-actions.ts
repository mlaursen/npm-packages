import { type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Box } from "../box/box.js";
import { type BoxJustifyContent } from "../box/types.js";
import styles from "./dialog-actions-styles.js";

@customElement("mwc-dialog-actions")
export class DialogActions extends Box {
  static override styles = [...Box.styles, styles];

  @property({ reflect: true })
  override justify: BoxJustifyContent = "end";

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-actions": DialogActions;
  }
}
