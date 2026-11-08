import type { OverridableStringUnion } from "@mlaursen/utils";

import type { MarginProperties } from "../margin/types.js";
import type { PaletteProperties } from "../palette/types.js";
import type { DefaultComponentSize } from "../types.js";

export interface IconSizeOverrides {}
export type DefaultIconSize = DefaultComponentSize;
export type IconSize = OverridableStringUnion<
  DefaultIconSize,
  IconSizeOverrides
>;

export interface IconProperties extends PaletteProperties, MarginProperties {
  /** @defaultValue `"medium"` */
  size?: IconSize;
}
