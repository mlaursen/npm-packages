import type { OverridableStringUnion } from "@mlaursen/utils";

export interface DividerVariantOverrides {}
export type DefaultDividerVariant = "full-width" | "inset" | "middle";
export type DividerVariant = OverridableStringUnion<
  DefaultDividerVariant,
  DividerVariantOverrides
>;

export interface DividerProperties {
  size?: string;

  stretch?: string;

  /**
   * @defaultValue `"separator"`
   */
  role?: string;

  /**
   * @defaultValue `"full-width"`
   */
  variant?: DividerVariant;
}
