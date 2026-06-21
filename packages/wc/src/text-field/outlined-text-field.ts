import { customElement } from "lit/decorators.js";

import { TextField } from "./text-field.js";
import type { TextFieldVariant } from "./types.js";

/**
 * The `mwc-outlined-text-field` is the outlined variant of the text field.
 *
 * ```html
 * <mwc-outlined-text-field placeholder="Placeholder">
 *   <span slot="label">Label</span>
 * </mwc-outlined-text-field>
 * ```
 */
@customElement("mwc-outlined-text-field")
export class OutlinedTextField extends TextField {
  override variant: TextFieldVariant = "outlined";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-outlined-text-field": OutlinedTextField;
  }
}
