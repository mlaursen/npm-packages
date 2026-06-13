import { type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Dialog } from "../dialog/dialog.js";
import { type DialogWidth } from "../dialog/types.js";
import {
  type AnimateOptions,
  type AnimationList,
  type GetAnimationMap,
} from "../transition/types.js";
import { isSlotted } from "../utils/slots.js";
import {
  DEFAULT_SHEET_CLOSE_ANIMATION,
  DEFAULT_SHEET_OPEN_ANIMATION,
} from "./constants.js";
import styles from "./sheet-styles.js";
import {
  type AnimateSheetElementMap,
  type SheetPosition,
  type SheetProperties,
  type SheetShape,
  type SheetVariant,
} from "./types.js";

const BaseSheet = Dialog;

@customElement("mwc-sheet")
export class Sheet extends BaseSheet implements SheetProperties {
  static override styles = [...BaseSheet.styles, styles];

  @property({ reflect: true })
  variant: SheetVariant = "modal";

  @property({ reflect: true })
  override shape: SheetShape = "round";

  @property({ type: Boolean, attribute: "back-button" })
  backButton = false;

  @property({ type: Boolean, attribute: "close-button" })
  closeButton = false;

  @property({ reflect: true })
  position: SheetPosition = "right";

  @property({ reflect: true })
  override width: DialogWidth = "extra-small";

  override getOpenAnimation: GetAnimationMap<AnimateSheetElementMap> = () =>
    DEFAULT_SHEET_OPEN_ANIMATION;
  override getCloseAnimation: GetAnimationMap<AnimateSheetElementMap> = () =>
    DEFAULT_SHEET_CLOSE_ANIMATION;

  override _getAnimations(options: AnimateOptions): AnimationList {
    const { animate = true, opening } = options;
    if (!animate) {
      return [];
    }

    const getDefault = opening ? this.getOpenAnimation : this.getCloseAnimation;

    const { sheet } = animate === true ? getDefault() : animate();

    return [[this._dialog, sheet]];
  }

  override renderDefaultHeader(): TemplateResult {
    return html`
      <mwc-sheet-header
        id=${this.headerId}
        ?hidden=${!this.backButton && !this.closeButton && !this._hasTitle}
        ?back-button=${this.backButton}
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

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sheet": Sheet;
  }
}
