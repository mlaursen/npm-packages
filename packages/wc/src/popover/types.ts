import { type TemplateResult } from "lit";

import {
  type AnimateElementMap,
  type AnimatedElementProperties,
  type GetAnimationMap,
} from "../transition/types.js";

/**
 *                  ------------
 *                  |  above   |
 *        ------|------------------|
 *        | top |   ------------   |
 *        ------|   |  center  |   |---------
 *              |   ------------   | bottom |
 *              |------------------|---------
 *                  |  below   |
 *                  ------------
 * Above:
 * - the container top is in-line with the bottom of the element.
 *
 * Below:
 * - the container bottom is in-line with the top of the element
 *
 * Center:
 * - the container center is in-line with the top of the element
 *
 * Top:
 * - the container top is in-line with the top of the element
 *
 * Bottom:
 * - the container bottom is in-line with the bottom of the element
 */
export type VerticalAnchor = "above" | "below" | "center" | "top" | "bottom";

/**
 *
 *     ----------    ---------------
 *     |  left  |    | inner-right |
 *     ---------|------------------|
 *              |   ------------   |
 *              |   |  center  |   |
 *              |   ------------   |
 *              |------------------|--------
 *              | inner-left |     | right |
 *              --------------     ---------
 * Left:
 * - the container left is in-line with the right of the element
 *
 * Right:
 * - the container right is in-line with the left of the element
 *
 * Center:
 * - the container's horizontal center point will be aligned with the element's
 *   horizontal center point
 *
 * Inner Left:
 * - the container's left is in-line with the left of the element
 *
 * Inner Right:
 * - the container's right is in-line with the right of the element
 */
export type HorizontalAnchor =
  "left" | "right" | "center" | "inner-left" | "inner-right";

export type PopoverType = "auto" | "hint" | "manual" | (string & {});
export type PopoverInitiator =
  "all" | "focus" | "hover" | "click" | "no-click" | "no-focus" | "no-hover";
export type PopoverInitiatorAction = "focus" | "hover" | "click" | "force";

export interface RenderPopoverTargetOptions {
  target?: TemplateResult;
  content: TemplateResult;
}

export type AnimatePopoverElementMap = AnimateElementMap<"popover" | "content">;

export interface PopoverProperties extends AnimatedElementProperties {
  /**
   * @see {@link HorizontalAnchor}
   * @defaultValue `"center"`
   */
  anchorX: HorizontalAnchor;

  /**
   * @see {@link VerticalAnchor}
   * @defaultValue `"below"`
   */
  anchorY: VerticalAnchor;

  /**
   * The popover will only be enabled if this property is defined.
   *
   * @see {@link HTMLElement.popover}
   */
  popoverType?: PopoverType;

  /**
   * @defaultValue `"all"`
   */
  popoverInitiator: PopoverInitiator;

  /**
   * An optional override for how long (in ms) to focus or hover the popover
   * target before showing the popover.
   *
   * @see {@link hoverDelay} for hover only override
   * @see {@link focusDelay} for focus only override
   *
   * @defaultValue `0`
   */
  showDelay?: number;

  /**
   * An optional override for how long (in ms) the popover target must not
   * have focus or hover before hiding the popover.
   *
   * @defaultValue `0`
   */
  hideDelay?: number;

  /**
   * An optional override for how long (in ms) to hover the popover target
   * before showing the popover.
   */
  hoverDelay?: number;

  /**
   * An optional override for how long (in ms) to focus the popover target
   * before showing the popover.
   */
  focusDelay?: number;

  /**
   * Convenience query element for the popover itself. Used for the
   * {@link showPopover} and {@link hidePopover}.
   */
  _popover?: HTMLSpanElement;

  /**
   * Convenience query for the `<div id="popover-content">`. Used for
   * animations.
   */
  _popoverContent?: HTMLDivElement;

  /**
   * This is mostly used internally to handle click events on the popover
   * target.
   */
  _popoverTarget?: HTMLSlotElement;

  /**
   * This will be `true` when the `<slot name="popover-target">` has at least
   * one element.
   */
  _hasPopoverTarget: boolean;

  /**
   * This is used to actually implement the popover behavior within the lit
   * element.
   *
   * @example Main Usage
   * ```ts
   * override render(): TemplateResult {
   *   return this.renderPopoverTarget({
   *     target: html`This is an optional default slot value for the <slot name="target">`,
   *     content: html`<slot name="content"></slot>`,
   *   });
   * }
   * ```
   */
  renderPopover(options?: RenderPopoverTargetOptions): TemplateResult;

  /**
   * This should be used when the popover element needs to be customized (like
   * dialogs) and the only part that is required is the popover-target slot.
   */
  renderPopoverTarget(target?: TemplateResult): TemplateResult;

  getShowPopoverAnimation: GetAnimationMap<AnimatePopoverElementMap>;
  getHidePopoverAnimation: GetAnimationMap<AnimatePopoverElementMap>;
}
