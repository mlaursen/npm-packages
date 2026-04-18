import type { LiteralStringUnion } from "@mlaursen/utils";
import type { TemplateResult } from "lit";

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
export type VerticalPosition = "above" | "below" | "center" | "top" | "bottom";

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
export type HorizontalPosition =
  | "left"
  | "right"
  | "center"
  | "inner-left"
  | "inner-right";

export type PopoverBehavior = LiteralStringUnion<"auto" | "hint" | "manual">;
export type PopoverInitiator = "focus" | "hover" | "click" | "force";

export interface RenderPopoverTargetOptions {
  target?: TemplateResult;
  content: TemplateResult;
}

export type PopoverControls = Pick<
  HTMLElement,
  "showPopover" | "hidePopover" | "togglePopover"
>;

export interface PopoverProperties extends PopoverControls {
  /**
   * @see {@link HorizontalPosition}
   * @defaultValue `"center"`
   */
  anchorX: HorizontalPosition;

  /**
   * @see {@link VerticalPosition}
   * @defaultValue `"below"`
   */
  anchorY: VerticalPosition;

  /**
   * The popover will only be enabled if this property is defined.
   *
   * @see {@link HTMLElement.popover}
   */
  popoverBehavior?: PopoverBehavior;

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

  disableFocus?: boolean;
  disableHover?: boolean;

  /**
   * Convenience query element for the popover itself. Used for the
   * {@link showPopover} and {@link hidePopover}.
   */
  _popover?: HTMLSpanElement;

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
  renderPopoverTarget(options?: RenderPopoverTargetOptions): TemplateResult;
}
