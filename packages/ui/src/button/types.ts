import {
  type DefaultComponentExtraSize,
  type OverridableStringUnion,
} from "../types.js";

export interface ButtonSizeOverrides {}
export type DefaultButtonSize = DefaultComponentExtraSize;
export type ButtonSize = OverridableStringUnion<
  DefaultButtonSize,
  ButtonSizeOverrides
>;

export interface ButtonVariantOverrides {}
export type DefaultButtonVariant =
  | "text"
  | "outlined"
  | "tonal"
  | "filled"
  | "elevated";
export type ButtonVariant = OverridableStringUnion<
  DefaultButtonVariant,
  ButtonVariantOverrides
>;

export interface ButtonShapeOverrides {}
export type DefaultButtonShape = "round" | "square";
export type ButtonShape = OverridableStringUnion<
  DefaultButtonShape,
  ButtonShapeOverrides
>;
