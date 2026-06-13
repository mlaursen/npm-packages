import { type TemplateResult } from "lit";

import { type BaseAnimateOptions } from "../transition/types.js";
import { type Point } from "../types.js";

export type InteractionDirection = "inward" | "outward";

export interface RippleAnimateOptions extends BaseAnimateOptions {
  rippleSize: number;
  rippleScale: number;
  startPoint: Readonly<Point>;
  endPoint: Readonly<Point>;
}

export interface InteractionProperties {
  disabled: boolean;
  disableRipple: boolean;

  interaction: InteractionDirection;
}

export interface Interactable extends InteractionProperties {
  _ripple?: HTMLSpanElement;
  _pressed: boolean;

  renderRipple(): TemplateResult | null;
}
