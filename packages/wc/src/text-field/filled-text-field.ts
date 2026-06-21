import { customElement } from "lit/decorators.js";

import { TextField } from "./text-field.js";
import type { TextFieldVariant } from "./types.js";

/**
 * The `mwc-filled-text-field` is the filled variant of the text field.
 *
 * ```html
 * <mwc-filled-text-field placeholder="Placeholder">
 *   <span slot="label">Label</span>
 * </mwc-filled-text-field>
 * ```
 */
@customElement("mwc-filled-text-field")
export class FilledTextField extends TextField {
  override variant: TextFieldVariant = "filled";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-filled-text-field": FilledTextField;
  }
}
