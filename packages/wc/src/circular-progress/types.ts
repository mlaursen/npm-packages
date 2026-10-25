import type { OverridableStringUnion } from "@mlaursen/utils";

import type { ProgressProperties } from "../progress/types.js";
import type {
  DefaultComponentExtraSize,
  DefaultComponentShape,
  DefaultComponentSize,
} from "../types.js";

export interface CircularProgressShapeOverrides {}
export type DefaultCircularProgressShape = DefaultComponentShape;
export type CircularProgressShape = OverridableStringUnion<
  DefaultCircularProgressShape,
  CircularProgressShapeOverrides
>;

export interface CircularProgressSizeOverrides {}
export type DefaultCircularProgressSize = DefaultComponentExtraSize;
export type CircularProgressSize = OverridableStringUnion<
  DefaultCircularProgressSize,
  CircularProgressSizeOverrides
>;

export interface CircularProgressIndicatorWidthOverrides {}
export type DefaultCircularProgressIndicatorWidth = DefaultComponentSize;
export type CircularProgressIndicatorWidth = OverridableStringUnion<
  DefaultCircularProgressIndicatorWidth,
  CircularProgressIndicatorWidthOverrides
>;

export interface CircularProgressProperties extends ProgressProperties {
  /**
   * @defaultValue `"round"`
   */
  shape: CircularProgressShape;

  /**
   * @defaultValue `"medium"`
   */
  size: CircularProgressSize;

  /**
   * @defaultValue `"medium"`
   */
  indicatorWidth: CircularProgressIndicatorWidth;
}
