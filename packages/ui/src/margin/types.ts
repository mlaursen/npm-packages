import type { OverridableStringUnion } from "../types.js";

export interface MarginOverrides {}
export type DefaultMargin =
  | "none"
  | "top"
  | "bottom"
  | "centered"
  | "force-end";
export type Margin = OverridableStringUnion<DefaultMargin, MarginOverrides>;

export interface MarginProperties {
  margin?: Margin;
}
