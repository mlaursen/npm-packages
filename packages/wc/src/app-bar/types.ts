import type { OverridableStringUnion } from "@mlaursen/utils";

import type { DefaultComponentSize } from "../types.js";

export interface AppBarSizeOverrides {}
export type DefaultAppBarSize =
  | DefaultComponentSize
  | "medium-subtitle"
  | "large-subtitle";
export type AppBarSize = OverridableStringUnion<
  DefaultAppBarSize,
  AppBarSizeOverrides
>;

export interface AppBarVariantOverrides {}
// NOTE: Material Design has this as `"search" | "flexible"`, but these are two separate components here
export type DefaultAppBarVariant = "flexible" | "toolbar" | "custom";
export type AppBarVariant = OverridableStringUnion<
  DefaultAppBarVariant,
  AppBarVariantOverrides
>;

export interface AppBarStuckToOverrides {}
export type DefaultAppBarStuckTo = "top" | "bottom";
export type AppBarPosition = OverridableStringUnion<
  DefaultAppBarStuckTo,
  AppBarStuckToOverrides
>;

export interface AppBarScrollOverrides {}
export type DefaultAppBarScroll =
  | "static"
  | "sticky"
  | "sticky-upwards"
  | "fixed"
  | "fixed-upwards";

export interface AppBarTitlePositionOverrides {}
export type DefaultAppBarTitlePosition = "start" | "center";
export type AppBarTitlePosition = OverridableStringUnion<
  DefaultAppBarTitlePosition,
  AppBarTitlePositionOverrides
>;

/**
 * - `static` - no scroll behavior
 * - `sticky` - use `position: sticky`
 * - `sticky-upwards` - use `position: sticky`, but hide the app bar when
 *   scrolling down the page. Re-show when scrolling upwards
 * - `fixed` - use `position: fixed`
 * - `fixed-upwards` - the same as `sticky-upwards`, but with `position: fixed`
 */
export type AppBarScrollBehavior = OverridableStringUnion<
  DefaultAppBarScroll,
  AppBarScrollOverrides
>;

export interface AppBarProperties {
  /**
   * @see AppBarSize
   * @inheritdoc AppBarSize
   * @defaultValue `"small"`
   */
  size?: AppBarSize;

  /**
   * @see AppBarVariant
   * @inheritdoc AppBarVariant
   * @defaultValue `"flexible"`
   */
  variant?: AppBarVariant;

  /**
   * @see AppBarPosition
   * @inheritdoc AppBarPosition
   * @defaultValue `"top"`
   */
  position?: AppBarPosition;

  /**
   * @defaultValue `"sticky"`
   */
  scrollBehavior?: AppBarScrollBehavior;

  /**
   * This property should normally not be set manually as it is automatically
   * set using an Intersection Observer. It is used to add additional box
   * shadow when scrolled and elevated
   */
  scrolled?: boolean;

  /**
   * Set this to `true` to enable the subtitle slot in the default
   * `mwc-app-bar-title`. This is `false` by default so that it does not affect
   * the layout styling.
   *
   * @defaultValue `false`
   */
  subtitle?: boolean;

  /**
   * Set this to `true` if you do not want to render the default
   * `mwc-app-bar-title` and related slots. This should really only be required
   * if styling is messed up for some reason.
   *
   * @defaultValue `false`
   */
  disableTitle?: boolean;

  /**
   * @defaultValue `"start"`
   */
  titlePosition?: AppBarTitlePosition;

  /**
   * Set this to `true` to prevent rendering everything related to the
   * `actions` slot.
   *
   * @defaultValue `false`
   */
  disableActions?: boolean;

  /**
   * Set this to `true` remove the elevation from the app bar and just render
   * with borders.
   *
   * @defaultValue `false`
   */
  disableElevation?: boolean;
}
