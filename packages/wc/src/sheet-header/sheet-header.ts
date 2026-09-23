import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

import styles from "./sheet-header-styles.js";
import type { SheetHeaderAutoFocus, SheetHeaderProperties } from "./types.js";

/**
 * @slot - The default slot can be used to render any content after the
 * optional title slot but before the optional close button slot. It is
 * generally not recommended to use the default slot too much and instead swap
 * the sheet header with the dialog header or a custom header.
 * @slot back-icon - An optional slot that can be used to change the default
 * back icon.
 * @slot back-button - An optional slot that can be used to change the default
 * back button. This button will no longer automatically close the sheet and
 * will need to be implemented yourself.
 * @slot close-icon - An optional slot that can be used to change the default
 * close icon.
 * @slot close-button - An optional slot that can be used to change the default
 * close button. This button will no longer automatically close the sheet and
 * will need to be implemented yourself.
 * @slot title - An optional slot for rendering a title in the header. This
 * should generally be the `<mwc-sheet-title>` or another `<mwc-typography>`
 * implementation.
 */
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
      <slot></slot>
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
    // the default header allows the close to be canceled
    this.closest("dialog")?.requestClose();
  }
}
