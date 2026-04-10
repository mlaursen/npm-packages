import {
  type DefaultComponentSize,
  type OverridableStringUnion,
} from "../types.js";

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
