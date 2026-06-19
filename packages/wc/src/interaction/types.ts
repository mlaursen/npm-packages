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
  _pressed: boolean;
  _focusVisible: boolean;

  _ripple?: HTMLSpanElement;
  _stateLayer?: HTMLSpanElement;

  _renderRipple(): TemplateResult | null;
  _renderStateLayer(): TemplateResult;

  /**
   * This should be used when the host itself cannot gain focus since
   * `:host(:has())` selectors do not really work at this time.
   *
   * @example
   * ```ts
   * <a class="state-layer-target" @focus=${this._updateFocusVisible} @blur=${this._updateFocusVisible}>
   *   <slot></slot>
   * </a>
   * ```
   */
  _updateFocusVisible(event: FocusEvent): void;
}
