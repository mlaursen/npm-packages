import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { TextField } from "./text-field.js";
import type { TextFieldVariant } from "./types.js";

@customElement("mwc-outlined-text-field")
export class OutlinedTextField extends TextField {
  override variant: TextFieldVariant = "outlined";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-outlined-text-field": OutlinedTextField;
  }
}
