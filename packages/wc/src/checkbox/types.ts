import type { OverridableStringUnion } from "@mlaursen/utils";

import type {
  AnimateElementMap,
  BaseAnimationOptions,
  GetAnimationMap,
} from "../animations/types.js";
import type { FormValidationStates } from "../form-validation/types.js";
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
  BaseAnimationOptions<AnimateCheckboxElementMap>;

export interface CheckboxProperties extends FormValidationStates {
  size?: CheckboxSize;
  name?: string;
  checked: boolean;
  indeterminate: boolean;

  getCheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
  getUncheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
  getIndeterminateAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
}
