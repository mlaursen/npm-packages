import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("ui-form-test")
export class FormTest extends LitElement {
  override render(): TemplateResult {
    return html`
      <form name="main" .onsubmit=${this.handleSubmit}>
        <label>
          Name
          <input type="text" name="name" />
        </label>
        <slot name="submit"><button type="submit">Submit</button></slot>
      </form>
    `;
  }

  handleSubmit(event: Event): void {
    console.log("submit");
    event.preventDefault();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-form-test": FormTest;
  }
}
