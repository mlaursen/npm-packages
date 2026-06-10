import { type OverridableStringUnion } from "@mlaursen/utils";

import {
  type PopoverInitiator,
  type PopoverProperties,
  type PopoverType,
} from "../popover/types.js";
import {
  type AnimateElementMap,
  type BaseAnimateOptions,
  type GetAnimationMap,
} from "../transition/types.js";
import { type DefaultComponentExtraSize } from "../types.js";

export interface DialogWidthOverrides {}
export type DefaultDialogWidth = DefaultComponentExtraSize;
export type DialogWidth = OverridableStringUnion<
  DefaultDialogWidth,
  DialogWidthOverrides
>;

export type DialogType = "alert";

export type AnimateDialogElementMap = AnimateElementMap<
  "dialog" | "header" | "content" | "actions"
>;

export type ShowDialogOptions = BaseAnimateOptions<AnimateDialogElementMap>;

export interface CloseDialogOptions extends ShowDialogOptions {
  /** @see {@link HTMLDialogElement.returnValue} */
  returnValue?: string;
}

export interface DialogProperties extends PopoverProperties {
  /**
   * This is a pass-through for the `aria-label` attribute on the `dialog`
   * element
   */
  label?: string;

  /**
   * This is a pass-through for the `aria-labelledby` attribute on the `dialog`
   * element. If this and {@link label} are omitted and the `"title"` slot is
   * provided, it will default to to the title element.
   */
  labelledBy?: string;

  /**
   * This is a pass-through for the `aria-describedby` attribute on the
   * `dialog` element. If the {@link type} is set to `"alert"` and the
   * `"content"` slot is provided, it will default to the content element.
   */
  describedBy?: string;

  /**
   * Set this to `"alert"` to update the `dialog` to have the `"alertdialog"`
   * role.
   */
  type?: DialogType;

  /**
   * An optional width to enforce for the dialog. Defaults to the size of the
   * content. This can also be configured by setting the `--mwc-dialog-width`
   * custom property.
   */
  width?: DialogWidth;

  /** @see {@link HTMLDialogElement.returnValue} */
  returnValue: HTMLDialogElement["returnValue"];

  /**
   * This function will show the dialog with an animation using
   * `dialog.showModal()` returning a promise that will resolve once the
   * animations have completed.
   *
   * @example Show
   * ```ts
   * const dialog = document.querySelector("mwc-dialog");
   * await dialog.show();
   * console.log("Dialog is open!");
   * ```
   *
   * @see {@link getOpenAnimation} to configure the open animation.
   */
  show: (options?: Readonly<ShowDialogOptions>) => Promise<void>;

  /**
   * This function will close the dialog with an animation using
   * `dialog.close()` returning a promise that will resolve once the animations
   * have completed.
   *
   * @example Hide
   * ```ts
   * const dialog = document.querySelector("mwc-dialog");
   * await dialog.close();
   * console.log("Dialog is closed!");
   * ```
   *
   * @see {@link getOpenAnimation} to configure the open animation.
   */
  close: (options?: Readonly<CloseDialogOptions>) => Promise<void>;

  /** @defaultValue `() => DEFAULT_DIALOG_OPEN_ANIMATION` */
  getOpenAnimation: GetAnimationMap<AnimateDialogElementMap>;

  /** @defaultValue `() => DEFAULT_DIALOG_CLOSE_ANIMATION` */
  getCloseAnimation: GetAnimationMap<AnimateDialogElementMap>;

  /**
   * NOTE: The popover properties are only used when a `slot="popover-target"`
   * has been provided.
   *
   * @defaultValue `"manual"`
   * @see {@link PopoverProperties.popoverType}
   */
  popoverType?: PopoverType;

  /**
   * NOTE: The popover properties are only used when a `slot="popover-target"`
   * has been provided.
   *
   * @defaultValue `"click"`
   * @see {@link PopoverProperties.popoverInitiator}
   */
  popoverInitiator: PopoverInitiator;
}
