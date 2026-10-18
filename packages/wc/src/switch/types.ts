import type { OverridableStringUnion } from "@mlaursen/utils";

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

export interface SwitchProperties {
  /**
   * @defaultValue `"medium"`
   */
  size: SwitchSize;
  error: boolean;
  checked: boolean;
  required: boolean;
  value: string;

  /**
   * @defaultValue `"never"`
   */
  icons: SwitchIcons;
}
