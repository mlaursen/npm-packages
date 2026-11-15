import type { OverridableStringUnion } from "@mlaursen/utils";

import type { InteractionProperties } from "../interaction/types.js";
import type { MarginProperties } from "../margin/types.js";
import type { PaletteProperties } from "../palette/types.js";
import type { DefaultComponentSize } from "../types.js";

export interface SwitchSizeOverrides {}
export type DefaultSwitchSize = DefaultComponentSize;
export type SwitchSize = OverridableStringUnion<
  DefaultSwitchSize,
  SwitchSizeOverrides
>;

/**
 * This controls when icons will be displayed within a switch:
 * - `"never"` - never.
 * - `"checked"` - only displays the checked icon while checked
 * - `"always"` - always displays the current icon
 */
export type SwitchIcons = "never" | "checked" | "always";

export interface SwitchProperties
  extends InteractionProperties, PaletteProperties, MarginProperties {
  /**
   * @defaultValue `"medium"`
   */
  size: SwitchSize;

  /**
   * @defaultValue `false`
   */
  error: boolean;

  /**
   * @defaultValue `false`
   */
  checked: boolean;

  /**
   * @defaultValue `false`
   */
  required: boolean;

  /**
   * @defaultValue `"on"`
   */
  value: string;

  /**
   * @defaultValue `"never"`
   */
  icons: SwitchIcons;
}
