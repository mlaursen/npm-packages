import type { OverridableStringUnion } from "@mlaursen/utils";

export interface SkeletonShapeOverrides {}
export type DefaultSkeletonShape = "circle" | "square" | "round";
export type SkeletonShape = OverridableStringUnion<
  DefaultSkeletonShape,
  SkeletonShapeOverrides
>;

export interface SkeletonSizeOverrides {}
export type DefaultSkeletonSize = "text" | "content";
/**
 * The default skeleton sizes are:
 *
 * - `"text"` - apply `height: var(--mwc-skeleton-height, 1em)` and
 *   `width: var(--mwc-skeleton-width, 100%)`;
 * - `"content"` - size is derived by content and applies `display: contents`
 *   to the `mwc-skeleton`
 */
export type SkeletonSize = OverridableStringUnion<
  DefaultSkeletonSize,
  SkeletonSizeOverrides
>;

export interface SkeletonVariantOverrides {}
export type DefaultSkeletonVariant = "fade" | "wave" | "diagonal" | "none";
/**
 * The default skeleton variants are:
 *
 * - `"fade"` - opacity 1 -> 0.5 -> 1 animation
 * - `"wave"` - similar to a linear progress bar that just animates the
 *   background horizontally
 * - `"diagonal"` - same as the wave animation but travels from the top-left to
 *   bottom-right corners
 * - `"none"` - yeah. no animation.
 */
export type SkeletonVariant = OverridableStringUnion<
  DefaultSkeletonVariant,
  SkeletonVariantOverrides
>;

export interface SkeletonProperties {
  /**
   * This controls if the skeleton styles and animation are active which is
   * `true` by default. This can be useful if you want to use the content as
   * the skeleton size and disable the animation/skeleton styles once the
   * content has loaded. So set this to `false` to disable all the skeleton
   * styles apply `display: contents` so its like the skeleton doesn't exist in
   * the DOM.
   *
   * @defaultValue `true`
   */
  active: boolean;

  /**
   * Controls the default size for the skeleton.
   * @defaultValue `"text"`
   */
  size: SkeletonSize;

  /**
   * @defaultValue `"round"`
   */
  shape: SkeletonShape;

  /**
   * @see SkeletonVariant
   * @defaultValue `fade`
   */
  variant: SkeletonVariant;

  /**
   * This can be used to help place randomized placeholder content in a layout
   * while loading content. It generates a random width percentage between
   * {@link minPercentage} and {@link maxPercentage} and sets as the
   * `--mwc-skeleton-width` custom property.
   *
   * @defaultValue `false`
   */
  randomWidth: boolean;

  /**
   * @see randomWidth
   * @defaultValue `40`
   */
  minPercentage: number;

  /**
   * @see randomWidth
   * @defaultValue `85`
   */
  maxPercentage: number;

  /**
   * It can sometimes be useful to apply randomized delay to items so
   * everything isn't animating at the same interval. This just generates an
   * `animation-delay` between the {@link minDelay} and {@link maxDelay} as the
   * `--mwc-skeleton-animation-delay`.
   *
   * @defaultValue `false`
   */
  randomDelay: boolean;

  /**
   * This is a `animation-delay` min value in milliseconds.
   *
   * @see randomDelay
   * @defaultValue `0`
   */
  minDelay: number;

  /**
   * This is a `animation-delay` max value in milliseconds.
   *
   * @see randomDelay
   * @defaultValue `400`
   */
  maxDelay: number;
}
