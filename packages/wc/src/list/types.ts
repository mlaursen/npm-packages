import type { OverridableStringUnion } from "@mlaursen/utils";

import type { AriaMixinProperties } from "../aria-mixin/types.js";
import type { PaletteProperties } from "../palette/types.js";

export interface ListSizeOverrides {}
export type DefaultListSize = "small" | "large";
export type ListSize = OverridableStringUnion<
  DefaultListSize,
  ListSizeOverrides
>;

export interface ListProperties extends AriaMixinProperties, PaletteProperties {
  /**
   * @defaultValue `"large"`
   */
  size: ListSize;

  /**
   * @defaultValue `false`
   */
  horizontal: boolean;
}
