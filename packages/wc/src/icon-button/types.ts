import type { OverridableStringUnion } from "@mlaursen/utils";

export interface IconButtonWidthOverrides {}
export type DefaultIconButtonWidth = "narrow" | "wide";
export type IconButtonWidth = OverridableStringUnion<
  DefaultIconButtonWidth,
  IconButtonWidthOverrides
>;

export interface IconButtonProperties {
  /**
   * @defaultValue `null`
   */
  width: IconButtonWidth | null;
}
