import type { OverridableStringUnion } from "@mlaursen/utils";

import type { ProgressProperties } from "../progress/types.js";
import type {
  DefaultComponentExtraSize,
  DefaultComponentSize,
} from "../types.js";

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
   * @defaultValue `"medium"`
   */
  size: CircularProgressSize;

  /**
   * @defaultValue `"medium"`
   */
  indicatorWidth: CircularProgressIndicatorWidth;
}
