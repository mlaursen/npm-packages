import type { OverridableStringUnion } from "@mlaursen/utils";

export interface ObjectFitVariantOverrides {}
export type DefaultObjectFitVariant =
  "contain" | "cover" | "fill" | "none" | "scale-down";
export type ObjectFitVariant = OverridableStringUnion<
  DefaultObjectFitVariant,
  ObjectFitVariantOverrides
>;
