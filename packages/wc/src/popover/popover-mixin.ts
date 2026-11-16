import type { TemplateResult } from "lit";
import { html } from "lit";
import { property, query, state } from "lit/decorators.js";

import { OpenCloseAnimateMixin } from "../animations/open-close-animate-mixin.js";
import type {
  AnimationList,
  AnimationOptions,
  GetAnimationMap,
} from "../animations/types.js";
import { ElevationMixin } from "../elevation/elevation-mixin.js";
import type {
  StylableLitElement,
  StyledLitElementWithProperties,
} from "../types.js";
import { mergeStyles } from "../utils/mergeStyles.js";
import { isSlotted } from "../utils/slots.js";
import {
  DEFAULT_HIDE_POPOVER_ANIMATION,
  DEFAULT_SHOW_POPOVER_ANIMATION,
} from "./constants.js";
import styles from "./popover-styles.js";
import type {
  AnimatePopoverElementMap,
  PopoverPlacement,
  PopoverPlacementProperties,
} from "./types.js";

/**
 * This mixin can be used to position an element using the popover placement
 * API.
 *
 * @csspart popover-arrow - This part can be used for customizing the popover
 * arrow when available.
 */
export function PopoverMixin<T extends StylableLitElement>(
  Base: T,
  reflect = true,
): StyledLitElementWithProperties<PopoverPlacementProperties, T> {
  const BaseStyled = OpenCloseAnimateMixin(ElevationMixin(Base));
  class PopoverPlacementElement
    extends BaseStyled
    implements PopoverPlacementProperties
  {
    static override styles = mergeStyles(BaseStyled, styles);

    @property({ reflect })
    placement: PopoverPlacement = "end-center";

    @property({ type: Boolean, reflect, attribute: "popover-arrow" })
    popoverArrow = false;

    @property({ type: Boolean, reflect, attribute: "popover-area" })
    popoverArea = false;

    @state()
    _hasPopoverArrow = false;

    @query(".popover")
    _popover?: HTMLDivElement;

    @query(".popover-content")
    _popoverContent?: HTMLDivElement;

    getShowPopoverAnimation: GetAnimationMap<AnimatePopoverElementMap> = () =>
      DEFAULT_SHOW_POPOVER_ANIMATION;
    getHidePopoverAnimation: GetAnimationMap<AnimatePopoverElementMap> = () =>
      DEFAULT_HIDE_POPOVER_ANIMATION;

    override _getAnimations(options: AnimationOptions): AnimationList {
      const { animate = true, opening } = options;
      if (!animate) {
        return [];
      }

      const getDefault = opening
        ? this.getShowPopoverAnimation
        : this.getHidePopoverAnimation;
      const { popover, content } = animate === true ? getDefault() : animate();

      return [
        [this._popover, popover],
        [this._popoverContent, content],
      ];
    }

    override showPopover(): void {
      this.show();
    }

    override _showElement(): void {
      this._popover?.showPopover();

      super._showElement();
    }

    override hidePopover(): void {
      this.close();
    }

    override _closeElement(): void {
      this._popover?.hidePopover();

      super._closeElement();
    }

    override _isOpenable(): boolean {
      return !this.open || !this._popover?.matches(":popover-open");
    }

    override _isClosable(): boolean {
      return this.open && !!this._popover;
    }

    renderPopoverArrow(arrow?: TemplateResult): TemplateResult {
      return html`<div
          part="popover-arrow"
          class="popover-arrow"
          ?hidden=${this._hasPopoverArrow || !this.popoverArrow}
        ></div>
        <slot
          name="popover-arrow"
          @slotchange=${this.#handlePopoverArrowSlotChange}
          ?hidden=${!this._hasPopoverArrow}
          >${arrow}</slot
        >`;
    }

    #handlePopoverArrowSlotChange(event: Event): void {
      this._hasPopoverArrow = isSlotted(event);
    }
  }

  return PopoverPlacementElement;
}
