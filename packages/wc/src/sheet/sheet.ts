import type { TemplateResult } from "lit";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { Dialog } from "../dialog/dialog.js";
import type { AnimateDialogElementMap, DialogWidth } from "../dialog/types.js";
import type { SheetHeaderAutoFocus } from "../sheet-header/types.js";
import type { GetAnimationMap } from "../transition/types.js";
import { isSlotted } from "../utils/slots.js";
import {
  DEFAULT_SHEET_CLOSE_ANIMATION,
  DEFAULT_SHEET_OPEN_ANIMATION,
} from "./constants.js";
import styles from "./sheet-styles.js";
import type {
  SheetPosition,
  SheetProperties,
  SheetShape,
  SheetVariant,
} from "./types.js";

const BaseSheet = Dialog;

/**
 *
 * NOTE: The `<mwc-dialog-header>` will be hidden if the `title`, `icon`, and
 * `header` slots are not provided.
 * NOTE: The `<mwc-dialog-content>` will be hidden if the `content` slot was not
 * provided.
 * NOTE: The `<mwc-dialog-actions>` will be hidden if the `actions` slot was not
 * provided.
 *
 * @slot - The default slot is rendered in the `<mwc-dialog-content>`. If you
 * do not want the default dialog content styling, but would still like the
 * content to automatically expand to fill the remaining height within the
 * dialog and add a scrollbar when overflown, use the `"dialog-content"` slot
 * instead.
 * @slot dialog-content - An optional slot that can be used if the default
 * `<mwc-dialog-content>` slot does not work for your use case.
 * @slot custom - An optional slot that is rendered before the last focus trap.
 * This can be used if none of the existing slots work for your use-case and
 * none of the styling is correct for those slots.
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
 * is rendered in the `<mwc-sheet-title>` element.
 * @slot actions - An optional repeatable slot for rendering within the
 * `<mwc-dialog-actions>` element. This should generally be `<mwc-button>` or
 * `<mwc-icon-button>`.
 *
 * @slot dialog-header - An optional slot that can be used if the
 * `<mwc-dialog-header>` slots do not work for your use case.
 * @slot dialog-actions - An optional slot that can be used if the default
 * `<mwc-dialog-actions>` slot does not work for your use case
 *
 * @fires {Event} open - Fired before the show animation occurs and can be used
 * to cancel opening the element by calling `event.preventDefault()`.
 * @fires {Event} opened - Fired once the element has opened and the animations
 * have completed.
 * @fires {Event} close - Fired before the hide animation occurs and can be
 * used to cancel closing the element by calling `event.preventDefault()`.
 * @fires {Event} closed - Fired once the element has closed and the animations
 * have completed.
 * @fires {Event} cancel - Fired before the dialog attempts to close after a
 * `requestClose` call and can prevent closing the dialog by calling
 * `event.preventDefault()`.
 *
 * NOTE: The `cancel` event will NOT be cancelable if the user spams the
 * `Escape` key or the back button on a mobile device as it is a browser
 * security feature to prevent users from being trapped within a `dialog`.
 */
export class Sheet extends BaseSheet implements SheetProperties {
  static override styles = [...BaseSheet.styles, styles];

  @property({ reflect: true })
  variant: SheetVariant = "modal";

  @property({ reflect: true })
  override shape: SheetShape = "round";

  @property({ attribute: "back-label" })
  backLabel?: string;

  @property({ type: Boolean, attribute: "back-button" })
  backButton = false;

  @property({ attribute: "close-label" })
  closeLabel?: string;

  @property({ type: Boolean, attribute: "close-button" })
  closeButton = false;

  @property({ reflect: true })
  position: SheetPosition = "right";

  @property({ reflect: true })
  override width: DialogWidth = "extra-small";

  @property({ attribute: "header-focus" })
  headerFocus?: SheetHeaderAutoFocus;

  @state()
  _hasHeaderContent = false;

  override getOpenAnimation: GetAnimationMap<AnimateDialogElementMap> = () =>
    DEFAULT_SHEET_OPEN_ANIMATION;
  override getCloseAnimation: GetAnimationMap<AnimateDialogElementMap> = () =>
    DEFAULT_SHEET_CLOSE_ANIMATION;

  override renderDefaultHeader(): TemplateResult {
    return html`
      <mwc-sheet-header
        id=${this.headerId}
        auto-focus=${ifDefined(this.headerFocus)}
        ?hidden=${!this.backButton && !this.closeButton && !this._hasTitle}
        back-label=${ifDefined(this.backLabel)}
        ?back-button=${this.backButton}
        close-label=${ifDefined(this.closeLabel)}
        ?close-button=${this.closeButton}
      >
        <slot name="back-button" slot="back-button"></slot>
        <slot name="back-icon" slot="back-icon">
          <mwc-material-symbol>arrow_back</mwc-material-symbol>
        </slot>
        <mwc-sheet-title
          id=${this.titleId}
          slot="title"
          ?hidden=${!this._hasTitle}
        >
          <slot name="title" @slotchange=${this.#handleTitleSlotChange}></slot>
        </mwc-sheet-title>
        <slot
          name="header"
          @slotchange=${this.#handleHeaderContentSlotChange}
          ?hidden=${!this._hasHeaderContent}
        ></slot>
        <slot name="close-button" slot="close-button"></slot>
        <slot name="close-icon" slot="close-icon">
          <mwc-material-symbol>close</mwc-material-symbol>
        </slot>
      </mwc-sheet-header>
    `;
  }

  #isHeaderRendered(): boolean {
    return (
      this._hasTitle ||
      this.backButton ||
      this.closeButton ||
      this._hasHeaderContent
    );
  }

  #handleTitleSlotChange(event: Event): void {
    this._hasTitle = isSlotted(event);
    this._hasHeader = this.#isHeaderRendered();
  }

  #handleHeaderContentSlotChange(event: Event): void {
    this._hasHeaderContent = isSlotted(event);
    this._hasHeader = this.#isHeaderRendered();
  }
}
