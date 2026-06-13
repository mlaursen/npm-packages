import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./sheet-header-styles.js";
import { type SheetHeaderProperties } from "./types.js";

@customElement("mwc-sheet-header")
export class SheetHeader extends LitElement implements SheetHeaderProperties {
  static override styles = styles;

  @property({ type: Boolean, attribute: "back-button" })
  backButton = false;

  @property()
  backLabel = "Back";

  @property({ type: Boolean, attribute: "close-button" })
  closeButton?: boolean;

  @property()
  closeLabel = "Close";

  override render(): TemplateResult {
    return html`
      <mwc-icon-button
        aria-label=${this.backLabel}
        @click=${this.#close}
        ?hidden=${!this.backButton}
      >
        <slot name="back-icon">
          <mwc-material-symbol>arrow_back</mwc-material-symbol>
        </slot>
      </mwc-icon-button>
      <mwc-typography
        class="title"
        color="on-surface-variant"
        variant="title"
        size="large"
        margin="none"
      >
        <slot name="title"></slot>
      </mwc-typography>
      <mwc-icon-button
        aria-label=${this.closeLabel}
        @click=${this.#close}
        ?hidden=${!this.closeButton}
      >
        <slot name="close-icon">
          <mwc-material-symbol>close</mwc-material-symbol>
        </slot>
      </mwc-icon-button>
    `;
  }

  #close(): void {
    this.dispatchEvent(
      new Event("request-close", {
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sheet-header": SheetHeader;
  }
}
