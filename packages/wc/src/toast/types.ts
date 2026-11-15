import type { OverridableStringUnion } from "@mlaursen/utils";

import type { AnimateElementMap } from "../animations/types.js";
import type { PopoverPlacementProperties } from "../popover/types.js";
import type { DefaultComponentShape } from "../types.js";

export interface ToastShapeOverrides {}
export type DefaultToastShape = DefaultComponentShape;
export type ToastShape = OverridableStringUnion<
  DefaultToastShape,
  ToastShapeOverrides
>;

export type AnimateToastElementMap = AnimateElementMap<
  "toast" | "content" | "action" | "closeButton"
>;

export interface ToastProperties extends PopoverPlacementProperties {
  /**
   * @defaultValue `"square"`
   */
  shape: ToastShape;

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
