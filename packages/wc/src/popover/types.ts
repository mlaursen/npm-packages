import type { OverridableStringUnion } from "@mlaursen/utils";
import type { TemplateResult } from "lit";

import type {
  AnimateElementMap,
  GetAnimationMap,
  OpenCloseAnimatedElementProperties,
} from "../animations/types.js";
import type { ElevationProperties } from "../elevation/types.js";

export interface PopoverPlacementOverrides {}

/**
 * ```
 *              inline-start       inline-center      inline-end
 *             ┌──────────────────┬──────────────────┬──────────────────┐
 *             │                  │                  │                  │
 * block-start │      start       │   start-center   │    start-end     │
 *             │                  │                  │                  │
 *             ├──────────────────┼──────────────────┼──────────────────┤
 *             │                  │ ┌──────────────┐ │                  │
 *             │                  │ │    anchor    │ │                  │
 * block-center│   center-start   │ │   (center)   │ │    center-end    │
 *             │                  │ └──────────────┘ │                  │
 *             ├──────────────────┼──────────────────┼──────────────────┤
 *             │                  │                  │                  │
 * block-end   │    end-start     │    end-center    │       end        │
 *             │                  │                  │                  │
 *             └──────────────────┴──────────────────┴──────────────────┘
 * ```
 */
export type DefaultPopoverPlacement =
  | "start"
  | "start-center"
  | "start-end"
  | "center-start"
  | "center"
  | "center-end"
  | "end-start"
  | "end-center"
  | "end";
/** @see DefaultPopoverPlacement */
export type PopoverPlacement = OverridableStringUnion<
  DefaultPopoverPlacement,
  PopoverPlacementOverrides
>;

export type AnimatePopoverElementMap = AnimateElementMap<"popover" | "content">;

export interface PopoverPlacementProperties
  extends OpenCloseAnimatedElementProperties, ElevationProperties {
  /**
   * @see PopoverPlacement
   * @defaultValue `"end-center"`
   */
  placement: PopoverPlacement;

  /**
   * Set to true to render an arrow from the popover to the target element.
   * This will also be `true` if a `slot="popover-arrow"` was provided.
   *
   * @defaultValue `false`
   */
  popoverArrow: boolean;

  /**
   * Set this to `true` if the popover should also set the popover area styles
   * which is useful when there is a popover target.
   *
   * @defaultValue `false`
   */
  popoverArea: boolean;

  /**
   * This can be used to override the animation used when showing the popover.
   * The default animation is a simple opacity transition that can be
   * customized using the following custom properties:
   * - `--mwc-popover-closed-opacity` - defaults to `0`
   * - `--mwc-popover-closed-transform` - defaults to `scale(1)`
   * - `--mwc-popover-open-opacity` - defaults to `1`
   * - `--mwc-popover-open-transform` - defaults to `scale(1)`
   *
   * @virtual
   */
  getShowPopoverAnimation: GetAnimationMap<AnimatePopoverElementMap>;

  /**
   * This can be used to override the animation used when hiding the popover.
   * The default animation is a simple opacity transition that can be
   * customized using the following custom properties:
   * - `--mwc-popover-closed-opacity` - defaults to `0`
   * - `--mwc-popover-closed-transform` - defaults to `scale(1)`
   * - `--mwc-popover-open-opacity` - defaults to `1`
   * - `--mwc-popover-open-transform` - defaults to `scale(1)`
   *
   * @virtual
   */
  getHidePopoverAnimation: GetAnimationMap<AnimatePopoverElementMap>;

  /**
   * This can be used to override how the popover arrow element is rendered.
   *
   * @sealed
   */
  renderPopoverArrow(arrow?: TemplateResult): TemplateResult;

  /**
   * Convenience query element for the popover itself. Used for the
   * {@link showPopover} and {@link hidePopover}.
   *
   * @sealed
   */
  _popover?: HTMLSpanElement;

  /**
   * Convenience query for the `<div id="popover-content">`. Used for
   * animations.
   *
   * @sealed
   */
  _popoverContent?: HTMLDivElement;

  /**
   * This will be `true` when the `<slot name="popover-arrow">` has at least
   * one element.
   *
   * @readonly
   */
  _hasPopoverArrow: boolean;
}
