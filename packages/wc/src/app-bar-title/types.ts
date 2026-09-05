import type { AppBarSize, AppBarTitlePosition } from "../app-bar/types.js";

export interface AppBarTitleProperties {
  /**
   * @defaultValue `"small"`
   */
  size?: AppBarSize;

  /**
   * Set this to `true` when providing a
   * `<div slot="subtitle">Subtitle message</div>` to get the correct styling.
   *
   * @defaultValue `false`
   */
  subtitle?: boolean;

  /**
   * @defaultValue `"start"`
   */
  position?: AppBarTitlePosition;
}
