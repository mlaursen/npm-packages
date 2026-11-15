import type { OverridableStringUnion } from "@mlaursen/utils";

import type {
  AnimateElementMap,
  GetAnimationMap,
  OpenCloseAnimatedElementProperties,
} from "../animations/types.js";
import type { MarginProperties } from "../margin/types.js";
import type { DefaultPopoverPlacement } from "../popover/types.js";
import type { DefaultComponentShape } from "../types.js";

export interface ToastShapeOverrides {}
export type DefaultToastShape = DefaultComponentShape;
export type ToastShape = OverridableStringUnion<
  DefaultToastShape,
  ToastShapeOverrides
>;

export interface ToastPlacementOverrides {}
export type DefaultToastPlacement = DefaultPopoverPlacement;
/** @see DefaultPopoverPlacement */
export type ToastPlacement = OverridableStringUnion<
  DefaultToastPlacement,
  ToastPlacementOverrides
>;

export type AnimateToastElementMap = AnimateElementMap<
  "toast" | "content" | "action" | "closeButton"
>;

export interface ToastProperties
  extends MarginProperties, OpenCloseAnimatedElementProperties {
  /**
   * @defaultValue `"square"`
   */
  shape: ToastShape;

  /**
   * @defaultValue `"end-center"`
   */
  placement: ToastPlacement;

  /**
   * @defaultValue `false`
   */
  paused: boolean;

  /**
   * The timeout (in ms) before the toast hides.
   *
   * @defaultValue `5000`
   */
  timeout: number | null;

  /** @defaultValue `() => DEFAULT_DIALOG_OPEN_ANIMATION` */
  getOpenAnimation: GetAnimationMap<AnimateToastElementMap>;

  /** @defaultValue `() => DEFAULT_DIALOG_CLOSE_ANIMATION` */
  getCloseAnimation: GetAnimationMap<AnimateToastElementMap>;
}

export type ToastStateAction = "started" | "paused";

export interface ToastState {
  startTime: number;
  elapsedTime: number;
  remainingTime: number;
}

export type ToastTimeoutStartedReason =
  | "opened"
  | "action-resolved"
  | "unhover"
  | "blur"
  | "visible";
export interface ToastTimeoutStartedEventDetail extends ToastState {
  state: "started";
  reason: ToastTimeoutStartedReason;
}

export type ToastTimeoutPausedReason =
  | "action-pending"
  | "hover"
  | "focus"
  | "hidden";

export interface ToastTimeoutPausedEventDetail extends ToastState {
  state: "paused";
  reason: ToastTimeoutPausedReason;
}

export type ToastStateChangeEventDetail =
  | ToastTimeoutStartedEventDetail
  | ToastTimeoutPausedEventDetail;
