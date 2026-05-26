import { type OverridableStringUnion } from "@mlaursen/utils";

import { type PassThroughLinkProperties } from "../link/types.js";
import { type DefaultComponentExtraSize } from "../types.js";

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

export interface ButtonLinkProperties extends PassThroughLinkProperties {
  "aria-current"?: "page";
  href?: string;
}

export interface ButtonProperties extends ButtonLinkProperties {
  /**
   * @defaultValue `"submit"`
   */
  type: HTMLButtonElement["type"];

  /**
   * @defaultValue `"small"`
   */
  size: ButtonSize;

  /**
   * @defaultValue `"round"`
   */
  shape: ButtonShape;

  /**
   * @defaultValue `"filled"`
   */
  variant: ButtonVariant;
}
