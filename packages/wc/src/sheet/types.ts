import { type OverridableStringUnion } from "@mlaursen/utils";

import {
  type AnimateDialogElementMap,
  type DialogProperties,
  type DialogWidth,
} from "../dialog/types.js";
import type {
  SheetHeaderAutoFocus,
  SheetHeaderProperties,
} from "../sheet-header/types.js";
import {
  type BaseAnimateOptions,
  type GetAnimationMap,
} from "../transition/types.js";
import { type DefaultComponentShape } from "../types.js";

export type ShowSheetOptions = BaseAnimateOptions<AnimateDialogElementMap>;

export interface SheetShapeOverrides {}
export type DefaultSheetShape = DefaultComponentShape;
export type SheetShape = OverridableStringUnion<
  DefaultSheetShape,
  SheetShapeOverrides
>;

interface SheetPositionOverrides {}
export type DefaultSheetPosition = "top" | "right" | "bottom" | "eft";
export type SheetPosition = OverridableStringUnion<
  DefaultSheetPosition,
  SheetPositionOverrides
>;

export interface SheetVariantOverrides {}
export type DefaultSheetVariant = "modal" | "detached" | "inline";
export type SheetVariant = OverridableStringUnion<
  DefaultSheetVariant,
  SheetVariantOverrides
>;

export interface SheetProperties
  extends DialogProperties, Omit<Partial<SheetHeaderProperties>, "autoFocus"> {
  /**
   * @defaultValue `"round"`
   */
  shape: SheetShape;

  /**
   * @defaultValue `"right"`
   */
  position: SheetPosition;

  /**
   * @defaultValue `"modal"`
   */
  variant: SheetVariant;

  /**
   * @defaultValue `"extra-small"`
   */
  width: DialogWidth;

  show: (options?: ShowSheetOptions) => Promise<void>;
  close: (options?: ShowSheetOptions) => Promise<void>;

  /** @defaultValue `() => DEFAULT_SHEET_OPEN_ANIMATION` */
  getOpenAnimation: GetAnimationMap<AnimateDialogElementMap>;

  /** @defaultValue `() => DEFAULT_SHEET_CLOSE_ANIMATION` */
  getCloseAnimation: GetAnimationMap<AnimateDialogElementMap>;

  /**
   * @defaultValue `"auto"`
   */
  headerFocus?: SheetHeaderAutoFocus;
}
