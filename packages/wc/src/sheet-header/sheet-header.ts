import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./sheet-header-styles.js";
import {
  type SheetHeaderAutoFocus,
  type SheetHeaderProperties,
} from "./types.js";

@customElement("mwc-sheet-header")
export class SheetHeader extends LitElement implements SheetHeaderProperties {
  static override styles = styles;

  @property({ attribute: "auto-focus" })
  autoFocus: SheetHeaderAutoFocus = "auto";

  @property({ type: Boolean, attribute: "back-button" })
  backButton = false;

  @property({ attribute: "back-label" })
  backLabel = "Back";

  @property({ type: Boolean, attribute: "close-button" })
  closeButton = false;

  @property({ attribute: "close-label" })
  closeLabel = "Close";

  override render(): TemplateResult {
    return html`
      <mwc-icon-button
        aria-label=${this.backLabel}
        @click=${this.#close}
        ?hidden=${!this.backButton}
        ?autofocus=${
          this.autoFocus === "back" ||
          (this.backButton && this.autoFocus === "auto")
        }
      >
        <slot name="back-icon">
          <mwc-material-symbol>arrow_back</mwc-material-symbol>
        </slot>
      </mwc-icon-button>
      <slot name="back-button"></slot>
      <slot name="title"></slot>
      <slot name="close-button"></slot>
      <mwc-icon-button
        aria-label=${this.closeLabel}
        @click=${this.#close}
        ?hidden=${!this.closeButton}
        ?autofocus=${
          this.autoFocus === "close" ||
          (this.closeButton && this.autoFocus === "auto")
        }
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
