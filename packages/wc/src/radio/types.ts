import type { OverridableStringUnion } from "@mlaursen/utils";

import type {
  AnimateElementMap,
  BaseAnimationOptions,
  GetAnimationMap,
} from "../animations/types.js";
import type { InteractionProperties } from "../interaction/types.js";
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

export type AnimateRadioOptions = BaseAnimationOptions<AnimateRadioElementMap>;

export interface RadioProperties extends InteractionProperties {
  name: string;
  checked: boolean;

  getCheckedAnimation: GetAnimationMap<AnimateRadioElementMap>;
  getUncheckedAnimation: GetAnimationMap<AnimateRadioElementMap>;
}
