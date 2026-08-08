import type { OverridableStringUnion } from "@mlaursen/utils";

import type { DefaultComponentShape } from "../types.js";

export interface CardVariantOverrides {}
export type DefaultCardVariant = "filled" | "outlined" | "elevated";
export type CardVariant = OverridableStringUnion<
  DefaultCardVariant,
  CardVariantOverrides
>;

export interface CardShapeOverrides {}
export type DefaultCardShape = DefaultComponentShape;
export type CardShape = OverridableStringUnion<
  DefaultCardShape,
  CardShapeOverrides
>;
