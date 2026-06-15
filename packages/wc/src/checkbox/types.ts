import { type OverridableStringUnion } from "@mlaursen/utils";

import {
  type AnimateElementMap,
  type BaseAnimateOptions,
  type GetAnimationMap,
} from "../transition/types.js";
import { type DefaultComponentSize } from "../types.js";

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

export interface CheckboxProperties {
  size: CheckboxSize;
  error: boolean;
  checked: boolean;
  indeterminate: boolean;

  getCheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
  getUncheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
  getIndeterminateAnimation: GetAnimationMap<AnimateCheckboxElementMap>;
}
