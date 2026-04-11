import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("app-material-symbols")
export class MaterialSymbols extends LitElement {
  override render(): TemplateResult {
    return html`
      <ui-typography variant="headline">Material Symbols</ui-typography>
      <material-symbol>favorite</material-symbol>
      <material-symbol size="small">favorite</material-symbol>
      <material-symbol size="medium">favorite</material-symbol>
      <material-symbol size="large">favorite</material-symbol>
      <material-symbol size="large" color="tertiary">favorite</material-symbol>
      <material-symbol size="large" color="tertiary">favorite</material-symbol>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-material-symbols": MaterialSymbols;
  }
}
