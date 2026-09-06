import type { OverridableStringUnion } from "@mlaursen/utils";

import type { FormControlStates } from "../form-control/types.js";
import type {
  AnimateElementMap,
  BaseAnimateOptions,
  GetAnimationMap,
} from "../transition/types.js";
import type { DefaultComponentSize } from "../types.js";

export interface CheckboxSizeOverrides {}
export type DefaultCheckboxSize = DefaultComponentSize;
export type CheckboxSize = OverridableStringUnion<
  DefaultCheckboxSize,
  CheckboxSizeOverrides
>;

export type AnimateCheckboxElementMap = AnimateElementMap<
  "icon" | "background" | "outline" | "shortMark" | "longMark"
>;

export type AnimateCheckboxOptions =
  BaseAnimateOptions<AnimateCheckboxElementMap>;

export interface CheckboxProperties extends FormControlStates {
  size?: CheckboxSize;
  name?: string;
  checked: boolean;
  indeterminate: boolean;

  getCheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
  getUncheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
  getIndeterminateAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
}
