import type { OverridableStringUnion } from "@mlaursen/utils";
import type { TemplateResult } from "lit";

import type {
  AnimateElementMap,
  OpenCloseAnimatedElementProperties,
  GetAnimationMap,
} from "../animations/types.js";

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

export type PopoverType = "auto" | "hint" | "manual" | (string & {});
export type PopoverInitiator =
  | "all"
  | "focus"
  | "hover"
  | "click"
  | "no-click"
  | "no-focus"
  | "no-hover";
export type PopoverInitiatorAction = "focus" | "hover" | "click" | "force";

export interface RenderPopoverTargetOptions {
  arrow?: TemplateResult;
  target?: TemplateResult;
  content: TemplateResult;
}

export type AnimatePopoverElementMap = AnimateElementMap<"popover" | "content">;

export interface PopoverProperties extends OpenCloseAnimatedElementProperties {
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
   * The popover will only be enabled if this property is defined.
   *
   * @see {@link HTMLElement.popover}
   */
  popoverType: PopoverType | null;

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
   * This is mostly used internally to handle click events on the popover
   * target.
   *
   * @sealed
   */
  _popoverTarget?: HTMLSlotElement;

  /**
   * This will be `true` when the `<slot name="popover-target">` has at least
   * one element.
   *
   * @readonly
   */
  _hasPopoverTarget: boolean;

  /**
   * This can be used to disable the popover event listeners if needed. The
   * default behavior is just `this._hasPopoverTarget` but might be useful
   * to check if content exists as well.
   *
   * @sealed
   */
  isPopoverEnabled(): boolean;

  /**
   * This can be used to add additional checks to see if the popover can be
   * opened like checking if the popover target is overflow. The default
   * implementation is:
   * `!!this.popoverType && !!this._popoverTarget && !this.open`
   *
   * @sealed
   */
  isPopoverOpenable(): boolean;

  /**
   * This can be used to add additional checks to see if the popover can be
   * closed. The default implementation is:
   * `!!this.popoverType && !!this._popoverTarget && this.open`
   *
   * @sealed
   */
  isPopoverClosable(): boolean;

  /**
   * This is used to actually implement the popover behavior within the lit
   * element.
   *
   * @example Main Usage
```ts
protected override render(): TemplateResult {
  return this.renderPopover({
    content: html`<slot name="tooltip"></slot>`,
  });
}
```
   *
   * @sealed
   */
  renderPopover(options?: RenderPopoverTargetOptions): TemplateResult;

  /**
   * This should be used when the popover element needs to be customized (like
   * dialogs) and the only part that is required is the popover-target slot.
   *
   * @example Main Usage
```ts
override render(): TemplateResult {
  return this.renderPopoverTarget({
    target: html`This is an optional default slot value for the <slot name="target">`,
    content: html`<slot name="content"></slot>`,
  });
}
```
   *
   * @sealed
   */
  renderPopoverTarget(target?: TemplateResult): TemplateResult;

  /**
   * This can be used to override how the popover arrow element is rendered.
   *
   * @sealed
   */
  renderPopoverArrow(arrow?: TemplateResult): TemplateResult;

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
}
