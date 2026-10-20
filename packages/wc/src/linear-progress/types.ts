import type { OverridableStringUnion } from "@mlaursen/utils";

import type { ProgressProperties } from "../progress/types.js";
import type { DefaultComponentShape, DefaultComponentSize } from "../types.js";

export interface LinearProgressShapeOverrides {}
export type DefaultLinearProgressShape = DefaultComponentShape;
export type LinearProgressShape = OverridableStringUnion<
  DefaultLinearProgressShape,
  LinearProgressShapeOverrides
>;

export interface LinearProgressSizeOverrides {}
export type DefaultLinearProgressSize = DefaultComponentSize;
export type LinearProgressSize = OverridableStringUnion<
  DefaultLinearProgressSize,
  LinearProgressSizeOverrides
>;

export interface LinearProgressProperties extends ProgressProperties {
  /**
   * This should be `"horizontal"` or `"vertical"`
   *
   * @defaultValue `"horizontal"`
   */
  ariaOrientation: string;

  /**
   * @defaultValue `"small"`
   */
  size: LinearProgressSize;

  /**
   * @defaultValue `"round"`
   */
  shape: LinearProgressShape;

  /**
   * Set to `true` to disable the dot that appears at the end of the linear
   * progress to show the trailing edge.
   *
   * @defaultValue `false`
   */
  disableStopIndicator: boolean;
}
