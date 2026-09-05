import type { OverridableStringUnion } from "@mlaursen/utils";

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

/**
 * Apply gap between items in the box:
 * - `"all"`    - `gap` applied
 * - `"row"`    - only `row-gap` is applied
 * - `"column"` - only `column-gap` is applied
 * - `"none"`   - no `gap` is applied
 *
 * The gap values can be configured using the following custom properties:
 * - `--mwc-box-gap-h` - horizontal gap (column-gap) defaults to
 *   `var(--mwc-box-gap)`
 * - `--mwc-box-gap-v` - vertical gap (row-gap) defaults to
 *   `var(--mwc-box-gap)`
 * - `--mwc-box-gap` - defaults to `var(--mwc-spacing-large, 1rem)`
 */
export type BoxGap = "all" | "row" | "column" | "none";

/**
 * Apply padding to the box:
 * - `"all"` - `padding-block` and `padding-inline` applied
 * - `"none"` - no padding applied
 *
 * The padding values can be configured using the following custom properties:
 * - `--mwc-box-padding-h` - horizontal padding (padding-inline) defaults to
 *   `var(--mwc-box-padding)`
 * - `--mwc-box-padding-v` - vertical padding (padding-block) defaults to
 *   `var(--mwc-box-padding)`
 * - `--mwc-box-padding`   - defaults to `var(--mwc-spacing-large, 1rem)`
 */
export type BoxPadding = "all" | "none";

/**
 * This is used to update the box to render with a grid layout instead of flex
 * layout.
 *
 * - `false`     - use flex layout
 * - `true`      - use grid layout the current `var(--mwc-box-columns)` value
 *   (defaults to `auto-fit`)
 * - `auto-fit`  - use grid layout and forces `auto-fit` columns
 * - `auto-fill` - use grid layout and forces `auto-fill` columns
 * - `{number}`  - use grid layout and forces `{number}` columns
 *
 * The grid columns can be manually configured using the `--mwc-box-columns`
 * custom property.
 */
export type BoxGrid = boolean | "fit" | "fill" | `${number}`;

export interface BoxProperties {
  /**
   * This is just the `align-items` css property.
   */
  align?: BoxAlignItems;

  /**
   * This is just the `justify-content` css property.
   */
  justify?: BoxJustifyContent;

  /**
   * Set to `true` to render as `inline-flex` instead of `flex` or
   * `inline-grid` instead of `grid` when {@link grid} is enabled.
   *
   * @defaultValue `false`
   */
  inline?: boolean;

  /**
   * @see BoxGrid
   * @inheritdoc BoxGrid
   * @defaultValue `false`
   */
  grid?: BoxGrid;

  /**
   * Set to `true` to apply `width: 100%`.
   *
   * @defaultValue `false`
   */
  fullWidth?: boolean;

  /**
   * Set to `true` to use `flex-direction: column` or `flex-direction:
   * column-reversed` if {@link reversed} is `true`
   *
   * NOTE: Does not apply if {@link grid} is not `false`
   *
   * @defaultValue `false`
   */
  stacked?: boolean;

  /**
   * Set to `true` to use `flex-direction: row-reversed` or `flex-direction:
   * column-reversed` when  {@link stacked} is `true`.
   *
   * NOTE: Does not apply if {@link grid} is not `false`
   *
   * @defaultValue `false`
   */
  reversed?: boolean;

  /**
   * @see BoxGap
   * @inheritdoc BoxGap
   * @defaultValue `"all"`
   */
  gap?: BoxGap;

  /**
   * @defaultValue `false`
   */
  nowrap?: boolean;

  /**
   * @defaultValue `"all"`
   */
  padding?: BoxPadding;
}
