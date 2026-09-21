import type { OverridableStringUnion } from "@mlaursen/utils";
import type { TemplateResult } from "lit";

import type {
  AnimateElementMap,
  BaseAnimateOptions,
  GetAnimationMap,
} from "../transition/types.js";
import type {
  DefaultComponentExtraSize,
  DefaultComponentShape,
} from "../types.js";

export interface DialogWidthOverrides {}
export type DefaultDialogWidth = DefaultComponentExtraSize;
export type DialogWidth = OverridableStringUnion<
  DefaultDialogWidth,
  DialogWidthOverrides
>;

export interface DialogTypeOverrides {}
export type DefaultDialogType = "alert" | "modal" | "fixed";
/**
 * The default dialog variant is `"modal"`.
 *
 * - `"modal"` - displays a clickable backdrop with the dialog when it is
 *   visible.
 * - `"alert"` - displays a non-interactive backdrop with the dialog when it is
 *   visible. The user must click on one of the actions within the dialog to
 *   close it and updates the role to `"alertdialog"`.
 * - `"fixed"` - does not display any backdrop and sets `position: fixed` on
 *   the `dialog`.
 *
 * If the `popover-type` attribute exists, it will render as a popover instead
 * which will not display the backdrop.
 */
export type DialogType = OverridableStringUnion<
  DefaultDialogType,
  DialogTypeOverrides
>;

export interface DialogShapeOverrides {}
export type DefaultDialogShape = DefaultComponentShape;
export type DialogShape = OverridableStringUnion<
  DefaultDialogShape,
  DialogShapeOverrides
>;

export type AnimateDialogElementMap = AnimateElementMap<
  "dialog" | "header" | "content" | "actions"
>;

export type ShowDialogOptions = BaseAnimateOptions<AnimateDialogElementMap>;

export interface CloseDialogOptions extends ShowDialogOptions {
  /** @see {@link HTMLDialogElement.returnValue} */
  returnValue?: string;
}

export interface RenderDialogOptions {
  header?: TemplateResult;
  content?: TemplateResult;
  actions?: TemplateResult;
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

  /**
   * @see {@link DialogType}
   * @defaultValue `"modal"`
   */
  type?: DialogType;

  /**
   * An optional width to enforce for the dialog. Defaults to the size of the
   * content. This can also be configured by setting the `--mwc-dialog-width`
   * custom property.
   */
  width?: DialogWidth;

  /**
   * @defaultValue `"round"`
   */
  shape: DialogShape;

  /** @see {@link HTMLDialogElement.returnValue} */
  returnValue: HTMLDialogElement["returnValue"];

  /**
   * This function will show the dialog with an animation using
   * `dialog.showModal()` returning a promise that will resolve once the
   * animations have completed.
   *
   * @example Show
```ts
const dialog = document.querySelector("mwc-dialog");
await dialog.show();
console.log("Dialog is open!");
```
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
```ts
const dialog = document.querySelector("mwc-dialog");
await dialog.close();
console.log("Dialog is closed!");
```
   *
   * @example Hide With Return Value
```ts
const dialog = document.querySelector("mwc-dialog");
await dialog.close("accepted");
console.log(`Dialog is closed! Return value: "${dialog.returnValue}"`);
```
   * @see {@link getOpenAnimation} to configure the open animation.
   * @see {@link HTMLDialogElement.close}
   */
  close: (
    returnValueOrOptions?: string | Readonly<CloseDialogOptions>,
  ) => Promise<void>;

  /**
   * This is implemented for the Invoker Commands API.
   * @see {@link HTMLDialogElement.requestClose}
   */
  requestClose: (returnValue?: string) => void;

  /** @defaultValue `() => DEFAULT_DIALOG_OPEN_ANIMATION` */
  getOpenAnimation: GetAnimationMap<AnimateDialogElementMap>;

  /** @defaultValue `() => DEFAULT_DIALOG_CLOSE_ANIMATION` */
  getCloseAnimation: GetAnimationMap<AnimateDialogElementMap>;

  /** This is implemented for the Invoker Commands API */
  showModal: () => void;
}
