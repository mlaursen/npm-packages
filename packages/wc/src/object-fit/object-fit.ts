import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./object-fit-styles.js";
import type { ObjectFitProperties, ObjectFitVariant } from "./types.js";

/**
 * @example Simple Image Card Grid
```html
<mwc-box grid align="stretch" full-width>
  <mwc-card align="center" justify="center">
    <mwc-object-fit>
      <img src="https://picsum.photos/200/300?image=30" alt="" />
    </mwc-object-fit>
  </mwc-card>
  <mwc-card align="center" justify="center">
    <mwc-object-fit>
      <img src="https://picsum.photos/300/200?image=3" alt="" />
    </mwc-object-fit>
  </mwc-card>
</mwc-box>
```
 *
 * @slot - The default slot for the content body. This should generally be an
 * `<img>`, `<video>`, `<media>`, `<object>`, `<embed>`, etc.
 */
@customElement("mwc-object-fit")
export class ObjectFit extends LitElement implements ObjectFitProperties {
  static override styles = styles;

  @property({ type: Boolean })
  inline = false;

  @property()
  variant: ObjectFitVariant = "contain";

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-object-fit": ObjectFit;
  }
}
