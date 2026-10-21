import type { OverridableStringUnion } from "@mlaursen/utils";

import type { MarginProperties } from "../margin/types.js";

export interface CodeBlockExampleOverrides {}
export type DefaultCodeBlockExample = "a" | "b";
export type CodeBlockExample = OverridableStringUnion<
  DefaultCodeBlockExample,
  CodeBlockExampleOverrides
>;

export interface CodeBlockProperties extends MarginProperties {
  /**
   * Set to `true` to allow the code to line wrap instead of showing scrollbars.
   * This is recommended when showing code within a limited space (like a right
   * fixed dialog/sheet).
   *
   * @defaultValue `false`
   */
  lineWrap: boolean;
}
