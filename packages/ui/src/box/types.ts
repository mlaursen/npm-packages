import { type OverridableStringUnion } from "../types.js";

export interface BoxAlignItemsOverrides {}
export interface BoxJustifyContentOverrides {}
export interface BoxGridNameOverrides {}

export type DefaultBoxAlignItems =
  | "start"
  | "flex-start"
  | "center"
  | "end"
  | "flex-end"
  | "stretch";
export type BoxAlignItems = OverridableStringUnion<
  DefaultBoxAlignItems,
  BoxAlignItemsOverrides
>;

export type DefaultBoxJustifyContent =
  | BoxAlignItems
  | "space-around"
  | "space-between"
  | "space-evenly";
export type BoxJustifyContent = OverridableStringUnion<
  DefaultBoxJustifyContent,
  BoxJustifyContentOverrides
>;

export type BoxGap = "all" | "row" | "column" | "none";
export type BoxPadding = "all" | "none";
export type BoxFlexDirection = "row" | "column";
export type BoxGrid = boolean | "fit" | "fill" | `${number}`;
