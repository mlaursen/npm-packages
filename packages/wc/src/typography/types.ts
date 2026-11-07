import type { OverridableStringUnion } from "@mlaursen/utils";

import type { PaletteProperties } from "../palette/types.js";
import type { DefaultComponentSize } from "../types.js";

export interface TypographySizeOverrides {}

export type TypographySize = OverridableStringUnion<
  DefaultComponentSize,
  TypographySizeOverrides
>;

export interface TypographyVariantOverrides {}

export type DefaultTypographyVariant =
  | "body"
  | "label"
  | "title"
  | "headline"
  | "display";

export type TypographyVariant = OverridableStringUnion<
  DefaultTypographyVariant,
  TypographyVariantOverrides
>;

export type TypographyTextAlign =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify"
  | "inherit"
  | null;
export type TypographyTextTransform =
  | "capitalize"
  | "uppercase"
  | "lowercase"
  | "inherit"
  | "none"
  | null;
export type TypographyTextOverflow =
  | "nowrap"
  | "ellipsis"
  | "clip"
  | "inherit"
  | null;

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

  /**
   * @defaultValue `null`
   */
  textAlign: TypographyTextAlign;

  /**
   * @defaultValue `null`
   */
  textTransform: TypographyTextTransform;

  /**
   * @defaultValue `null`
   */
  textOverflow: TypographyTextOverflow;
}
