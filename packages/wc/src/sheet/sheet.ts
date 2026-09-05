import type { TemplateResult } from "lit";
import { html } from "lit";
import { property } from "lit/decorators.js";
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
        <slot name="close-button" slot="close-button"></slot>

        <slot name="back-icon" slot="back-icon">
          <mwc-material-symbol>arrow_back</mwc-material-symbol>
        </slot>
        <mwc-sheet-title
          id=${this.titleId}
          slot="title"
          ?hidden=${!this._hasTitle}
        >
          <slot name="title" @slotchange=${this.#handleSlotChange}></slot>
        </mwc-sheet-title>
        <slot name="close-icon" slot="close-icon">
          <mwc-material-symbol>close</mwc-material-symbol>
        </slot>
      </mwc-sheet-header>
      <slot></slot>
    `;
  }

  #handleSlotChange(event: Event): void {
    this._hasTitle = isSlotted(event);
    this._hasHeader = this._hasTitle || this.backButton || this.closeButton;
  }
}
