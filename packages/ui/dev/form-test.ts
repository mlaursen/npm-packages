import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("form-test")
class FormTest extends LitElement {
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  override render(): TemplateResult {
    return html`
      <form @submit=${this.#handleSubmit}>
        <label>
          <ui-typography variant="label">Name</ui-typography>
          <input type="text" name="name" required />
        </label>
        <ui-button type="submit">Submit</ui-button>
        <ui-button type="reset">Reset</ui-button>
      </form>
    `;
  }

  #handleSubmit(event: SubmitEvent): void {
    console.log("submitted!");

    event.preventDefault();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "form-test": FormTest;
  }
}
