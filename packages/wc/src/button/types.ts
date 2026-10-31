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
  /** @defaultValue `false` */
  disabled: boolean;

  /** @defaultValue `""` */
  name: string;

  /** @defaultValue `"submit"` */
  type: HTMLButtonElement["type"];

  /**
   * @see ButtonSize
   * @defaultValue `"small"`
   */
  size: ButtonSize;

  /**
   * @see ButtonShape
   * @defaultValue `"round"`
   */
  shape: ButtonShape;

  /**
   * @see ButtonVariant
   * @defaultValue `"filled"`
   */
  variant: ButtonVariant;

  /**
   * @see [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
   *
   * NOTE: `commandfor` is unsupported due to being an id ref
   *
   * @defaultValue `""`
   */
  command: CommandAttribute | "";

  /**
   * @see [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
   *
   * @defaultValue `""`
   */
  commandFor: string;

  /**
   * This can be used to programmatically set the command target.
   *
   * @example
```ts
const target = document.querySelector("#some-element")
const button = document.querySelector("mwc-button");

button.commandForElement = target;
button.command = "--show-modal"
```
   *
   * @defaultValue `null`
   */
  commandForElement: Element | null;

  /**
   * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertarget)
   *
   * @defaultValue `""`
   */
  popoverTarget: string;

  /**
   * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertargetaction)
   *
   * @defaultValue `"toggle"`
   */
  popoverTargetAction: PopoverTargetAction;

  /**
   * This can be used to programmatically set the popover target.
   *
   * @example
```ts
const target = document.querySelector("#some-element")
const button = document.querySelector("mwc-button");

button.popoverTargetElement = target;
button.popoverTargetAction = "show-popover"
```
   *
   * @defaultValue `null`
   */
  popoverTargetElement: Element | null;

  // NOTE: `form` is unsupported due to being an id ref
  formAction: string;
  formEnctype: HTMLButtonElement["formEnctype"];
  formMethod: HTMLButtonElement["formMethod"];
  formNoValidate: boolean;
  formTarget: string;
}
