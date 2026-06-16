import type { OverridableStringUnion } from "@mlaursen/utils";

import type { InteractionProperties } from "../interaction/types.js";
import type {
  AnimateElementMap,
  BaseAnimateOptions,
  GetAnimationMap,
} from "../transition/types.js";
import type { DefaultComponentSize } from "../types.js";

export interface RadioSizeOverrides {}
export type DefaultRadioSize = DefaultComponentSize;
export type RadioSize = OverridableStringUnion<
  DefaultRadioSize,
  RadioSizeOverrides
>;

export type AnimateRadioElementMap = AnimateElementMap<
  "icon" | "mark" | "outline"
>;

export type AnimateRadioOptions = BaseAnimateOptions<AnimateRadioElementMap>;

export interface RadioProperties extends InteractionProperties {
  checked: boolean;

  getCheckedAnimation: GetAnimationMap<AnimateRadioElementMap>;
  getUncheckedAnimation: GetAnimationMap<AnimateRadioElementMap>;
}
