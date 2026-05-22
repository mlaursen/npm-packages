import { type OverridableStringUnion } from "@mlaursen/utils";

import { type DefaultComponentExtraSize } from "../types.js";

export interface IconSizeOverrides {}
export type DefaultIconSize = DefaultComponentExtraSize;
export type IconSize = OverridableStringUnion<
  DefaultIconSize,
  IconSizeOverrides
>;
