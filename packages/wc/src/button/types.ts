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

/**
 * This was added since it is not officially a part of the lib.d.ts file yet in
 * Typescript. Should be removed once it is.
 *
 * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#command)
 */
export type CommandAttribute =
  | "show-modal"
  | "close"
  | "request-close"
  | "show-popover"
  | "hide-popover"
  | "toggle-popover"
  | `--${string}`;

/**
 * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertargetaction)
 */
export type PopoverTargetAction = "show" | "hide" | "toggle";

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

  command?: CommandAttribute;
  commandfor?: string;
  popovertarget?: string;
  popovertargetaction?: PopoverTargetAction;
}
