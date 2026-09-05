import type { OverridableStringUnion } from "@mlaursen/utils";

export interface MarginOverrides {}

/**
 * - `"none"` - Used to disable all margin by applying `margin: 0`
 * - `"top"` - Used to maintain the default `margin-block-start` but removing
 *   the bottom by applying `margin-block-end: 0`
 * - `"bottom"` - Used to maintain the default `margin-block-end` but removing
 *   the top by applying `margin-block-start: 0`
 * - `"centered"` - Used to center an element horizontally by applying
 *   `margin-inline: auto`
 * - `"start"` - Used to force an element to the start horizontally by applying
 *   `margin-inline-end: auto`
 * - `"end"` - Used to force an element to the end horizontally by applying
 *   `margin-inline-start: auto`
 */
export type DefaultMargin =
  | "none"
  | "top"
  | "bottom"
  | "centered"
  | "start"
  | "end";
export type Margin = OverridableStringUnion<DefaultMargin, MarginOverrides>;

export interface MarginProperties {
  /**
   * Optionally applies one of the default margin variants.
   *
   * @see DefaultMargin
   * @see Margin
   */
  margin?: Margin;
}
