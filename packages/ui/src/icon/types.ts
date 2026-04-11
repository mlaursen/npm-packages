import {
  type DefaultComponentExtraSize,
  type OverridableStringUnion,
} from "../types.js";

export interface IconSizeOverrides {}
export type DefaultIconSize = DefaultComponentExtraSize;
export type IconSize = OverridableStringUnion<
  DefaultIconSize,
  IconSizeOverrides
>;
