import { type OverridableStringUnion } from "@mlaursen/utils";

import { type PaletteProperties } from "../palette/types.js";
import { type DefaultComponentSize } from "../types.js";

export interface TypographySizeOverrides {}

export type TypographySize = OverridableStringUnion<
  DefaultComponentSize,
  TypographySizeOverrides
>;

export interface TypographyVariantOverrides {}

export type DefaultTypographyVariant =
  "body" | "label" | "title" | "headline" | "display";

export type TypographyVariant = OverridableStringUnion<
  DefaultTypographyVariant,
  TypographyVariantOverrides
>;

export interface TypographyProperties extends PaletteProperties {
  /**
   * @defaultValue `"large"`
   */
  size: TypographySize;

  /**
   * @defaultValue `"body"`
   */
  variant: TypographyVariant;

  /**
   * @defaultValue `"body"`
   */
  prominent: boolean;
}
