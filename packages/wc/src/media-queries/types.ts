import type { OverridableStringUnion } from "@mlaursen/utils";
import type { ReactiveControllerHost } from "lit";

export interface MediaQueryNameOverrides {}
export type DefaultMediaQueryName =
  | "phone"
  | "tablet"
  | "tablet-only"
  | "desktop"
  | "large-desktop";
export type MediaQueryName = OverridableStringUnion<
  DefaultMediaQueryName,
  MediaQueryNameOverrides
>;

export type MediaQueryNameOrQuery = MediaQueryName | (string & {});

export type NamedMediaQueries = Readonly<Record<MediaQueryName, string>>;
export type GetNamedMediaQueries = () => NamedMediaQueries;

export interface MediaQueryControllerOptions {
  host: ReactiveControllerHost;
  query: MediaQueryNameOrQuery;

  /**
   * @defaultValue `MediaQueryController.getNamedQueries()`
   */
  getNamedQueries?: GetNamedMediaQueries;
}
