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
} from "./types.js";

const BaseSheet = Dialog;

@customElement("mwc-sheet")
export class Sheet extends BaseSheet implements SheetProperties {
  static override styles = [...BaseSheet.styles, styles];

  @property({ reflect: true })
  override shape: SheetShape = "round";

  @property({ type: Boolean, attribute: "back-button" })
  backButton?: boolean;

  @property({ type: Boolean, attribute: "close-button" })
  closeButton?: boolean;

  @property({ reflect: true })
  position: SheetPosition = "right";

  @property({ reflect: true })
  override width: DialogWidth = "extra-small";

  #hasTitle = false;

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

  override render(): TemplateResult {
    return this.renderDialog(html`
      <mwc-sheet-header
        ?hidden=${!this.backButton && !this.closeButton && !this.#hasTitle}
        ?back-button=${this.backButton}
        ?close-button=${this.closeButton}
      >
        <slot name="back-icon" slot="back-icon">
          <mwc-material-symbol>arrow_back</mwc-material-symbol>
        </slot>
        <slot
          name="sheet-title"
          slot="title"
          @slotchange=${this.#handleSlotChange}
        >
        </slot>
        <slot name="close-icon" slot="close-icon">
          <mwc-material-symbol>close</mwc-material-symbol>
        </slot>
      </mwc-sheet-header>
      <slot></slot>
    `);
  }

  #handleSlotChange(event: Event): void {
    this.#hasTitle = isSlotted(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sheet": Sheet;
  }
}
