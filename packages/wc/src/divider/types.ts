import type { OverridableStringUnion } from "@mlaursen/utils";

export interface DividerVariantOverrides {}
export type DefaultDividerVariant = "full-width" | "inset" | "middle";
export type DividerVariant = OverridableStringUnion<
  DefaultDividerVariant,
  DividerVariantOverrides
>;
