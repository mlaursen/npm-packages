import type { OverridableStringUnion } from "@mlaursen/utils";

export interface ObjectFitVariantOverrides {}
export type DefaultObjectFitVariant =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";
export type ObjectFitVariant = OverridableStringUnion<
  DefaultObjectFitVariant,
  ObjectFitVariantOverrides
>;

export interface ObjectFitProperties {
  /**
   * Setting this to `true` will ignore the `variant` attribute and behave as
   * `"scale-down"`. This really just allows for the scaled down version to be
   * placed at different edges of a flex/grid container instead of being forced
   * within the center.
   *
   * ```
   * scale down
   * -----------
   * |         |
   * |   xxx   |
   * |         |
   * -----------
   *
   * inline
   * -----------
   * |   xxx   |
   * |         |
   * |         |
   * -----------
   *
   * scale down (inside display: flex; align-items: flex-start; justify-content: flex-end)
   * -----------
   * |         |
   * |   xxx   |
   * |         |
   * -----------
   *
   * inline (inside display: flex; align-items: flex-start; justify-content: flex-end)
   * -----------
   * |         |
   * |         |
   * |xxx      |
   * -----------
   * ```
   *
   * @defaultValue `false`
   */
  inline?: boolean;

  /**
   * This sets the `object-fit` property allowing the content to be resized to
   * fit its container.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit}
   * @defaultValue `"contain"`
   */
  variant?: ObjectFitVariant;
}
