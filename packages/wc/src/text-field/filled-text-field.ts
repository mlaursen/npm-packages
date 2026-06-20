import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { TextField } from "./text-field.js";
import type { TextFieldVariant } from "./types.js";

@customElement("mwc-filled-text-field")
export class FilledTextField extends TextField {
  override variant: TextFieldVariant = "filled";
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-filled-text-field": FilledTextField;
  }
}
