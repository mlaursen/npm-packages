import type { OverridableStringUnion } from "@mlaursen/utils";

import {
  type AnimateElementMap,
  type GetAnimationMap,
} from "../transition/types.js";
import type { DefaultComponentExtraSize } from "../types.js";

export interface DialogWidthOverrides {}
export type DefaultDialogWidth = DefaultComponentExtraSize;
export type DialogWidth = OverridableStringUnion<
  DefaultDialogWidth,
  DialogWidthOverrides
>;

export type DialogType = "alert";

export type AnimateDialogOptions = AnimateElementMap<
  "dialog" | "header" | "content" | "actions"
>;

export interface ShowDialogOptions {
  animate?: boolean | (() => Readonly<AnimateDialogOptions>);
}

export interface CloseDialogOptions extends ShowDialogOptions {
  returnValue?: string;
}

export interface DialogProperties {
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

  type?: DialogType;

  width?: DialogWidth;

  returnValue: HTMLDialogElement["returnValue"];

  show: (options?: Readonly<ShowDialogOptions>) => Promise<void>;
  close: (options?: Readonly<CloseDialogOptions>) => Promise<void>;

  getOpenAnimation: GetAnimationMap<AnimateDialogOptions>;
  getCloseAnimation: GetAnimationMap<AnimateDialogOptions>;
}
