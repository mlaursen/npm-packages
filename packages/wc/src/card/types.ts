import type { OverridableStringUnion } from "@mlaursen/utils";

import type {
  BoxAlignItems,
  BoxJustifyContent,
  BoxGrid,
  BoxGap,
  BoxPadding,
  BoxProperties,
} from "../box/types.js";
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

export interface CardBoxProperties extends Omit<BoxProperties, "fullWidth"> {
  /**
   * @override
   * @defaultValue `"stretch"`
   */
  align?: BoxAlignItems;

  /**
   * @override
   * @defaultValue `"stretch"`
   */
  justify?: BoxJustifyContent;

  /**
   * @override
   * @defaultValue `true`
   */
  stacked?: boolean;

  /**
   * @override
   * @defaultValue `"none"`
   */
  gap?: BoxGap;

  /**
   * @override
   * @defaultValue `true`
   */
  nowrap?: boolean;

  /**
   * @override
   * @defaultValue `"none"`
   */
  padding?: BoxPadding;
}

export interface CardProperties extends CardBoxProperties {
  /**
   * @defaultValue `"elevated"`
   */
  variant?: CardVariant;

  /**
   * @defaultValue `"round"`
   */
  shape?: CardShape;
}
