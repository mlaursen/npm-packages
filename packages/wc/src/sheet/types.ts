import { type OverridableStringUnion } from "@mlaursen/utils";

import {
  type AnimateDialogElementMap,
  type DialogProperties,
  type DialogWidth,
} from "../dialog/types.js";
import {
  type AnimateElementMap,
  type BaseAnimateOptions,
  type GetAnimationMap,
} from "../transition/types.js";
import { type DefaultComponentShape } from "../types.js";

export type AnimateSheetElementMap = AnimateElementMap<
  "sheet" | keyof AnimateDialogElementMap
>;
export type ShowSheetOptions = BaseAnimateOptions<AnimateSheetElementMap>;

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

export interface SheetProperties extends DialogProperties {
  /**
   * @defaultValue `"round"`
   */
  shape: SheetShape;

  /**
   * @defaultValue `"right"`
   */
  position: SheetPosition;

  /**
   * @defaultValue `"extra-small"`
   */
  width: DialogWidth;

  show: (options?: ShowSheetOptions) => Promise<void>;
  close: (options?: ShowSheetOptions) => Promise<void>;

  /** @defaultValue `() => DEFAULT_SHEET_OPEN_ANIMATION` */
  getOpenAnimation: GetAnimationMap<AnimateSheetElementMap>;

  /** @defaultValue `() => DEFAULT_SHEET_CLOSE_ANIMATION` */
  getCloseAnimation: GetAnimationMap<AnimateSheetElementMap>;
}
