import type { OverridableStringUnion } from "@mlaursen/utils";

export interface ListSizeOverrides {}
export type DefaultListSize = "small" | "large";
export type ListSize = OverridableStringUnion<
  DefaultListSize,
  ListSizeOverrides
>;

export interface ListProperties {
  /**
   * @defaultValue `"ul`
   */
  as?: "ul" | "ol" | "div";

  /**
   * @defaultValue `"large"`
   */
  size?: ListSize;

  /**
   * @defaultValue `false`
   */
  horizontal?: boolean;
}
