import type { OverridableStringUnion } from "@mlaursen/utils";

import type { DefaultComponentSize } from "../types.js";

export interface IconSizeOverrides {}
export type DefaultIconSize = DefaultComponentSize;
export type IconSize = OverridableStringUnion<
  DefaultIconSize,
  IconSizeOverrides
>;

export interface IconProperties {
  /** @defaultValue `"medium"` */
  size?: IconSize;
}
