import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "./text-container-styles.js";

/**
 * @example
```html
<mwc-text-container>
  <mwc-typography variant="headline">
    <h1>Title</h1>
  </mwc-typography>
  <mwc-typography>
    <p>
      Here is a paragraph of text that will be legible by having an ideal
      line-length.
    </p>
  </mwc-typography>
</mwc-text-container>
```
 * @slot - The default slot for the content body.
 */
@customElement("mwc-text-container")
export class TextContainer extends LitElement {
  static override styles = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-text-container": TextContainer;
  }
}
