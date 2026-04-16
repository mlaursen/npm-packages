import { type OverridableStringUnion } from "@mlaursen/utils";

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
