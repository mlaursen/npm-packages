import type { OverridableStringUnion } from "@mlaursen/utils";

import type { PassThroughLinkProperties } from "../link/types.js";
import type {
  CommandAttribute,
  DefaultComponentExtraSize,
  DefaultComponentShape,
  PopoverTargetAction,
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
export type DefaultButtonShape = DefaultComponentShape;
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
  type?: HTMLButtonElement["type"];

  /**
   * @see ButtonSize
   * @defaultValue `"small"`
   */
  size?: ButtonSize;

  /**
   * @see ButtonShape
   * @defaultValue `"round"`
   */
  shape?: ButtonShape;

  /**
   * @see ButtonVariant
   * @defaultValue `"filled"`
   */
  variant?: ButtonVariant;

  /**
   * @see [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
   */
  command?: CommandAttribute;

  /**
   * @see [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
   */
  commandfor?: string;

  /**
   * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertargetaction)
   */
  popovertarget?: string;

  /**
   * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertargetaction)
   */
  popovertargetaction?: PopoverTargetAction;
}
