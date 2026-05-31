import { type OverridableStringUnion } from "@mlaursen/utils";

import { type DefaultComponentSize } from "../types.js";

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
   * @defaultValue `"small"`
   */
  size: AppBarSize;

  /**
   * @defaultValue `"flexible"`
   */
  variant: AppBarVariant;

  /**
   * @defaultValue `"top"`
   */
  position: AppBarPosition;

  /**
   * @defaultValue `"sticky"`
   */
  scrollBehavior: AppBarScrollBehavior;

  /**
   * @defaultValue `false`
   */
  disableActions?: boolean;

  /**
   * @defaultValue `false`
   */
  disableElevation?: boolean;

  /**
   * Set this to `true` if you do not want to render the default
   * `mwc-app-bar-title` and related slots. This should really only be required
   * if styling is messed up for some reason.
   *
   * @defaultValue `false`
   */
  disableTitle?: boolean;

  /**
   * Set this to `true` to enable the subtitle slot in the default
   * `mwc-app-bar-title`. This is `false` by default so that it does not affect
   * the layout styling.
   *
   * @defaultValue `false`
   */
  subtitle?: boolean;

  /**
   * @defaultValue `"start"`
   */
  titlePosition?: AppBarTitlePosition;
}

export interface AppBarTitleProperties {
  /**
   * @defaultValue `"small"`
   */
  size: AppBarSize;

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
  position: AppBarTitlePosition;
}
