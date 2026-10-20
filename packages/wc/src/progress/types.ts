import type { OverridableStringUnion } from "@mlaursen/utils";

import type { MarginProperties } from "../margin/types.js";

export interface ProgressVariantOverrides {}
export type DefaultProgressVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error";
export type ProgressVariant = OverridableStringUnion<
  DefaultProgressVariant,
  ProgressVariantOverrides
>;

export interface ProgressProperties extends MarginProperties {
  role: "progressbar";

  /**
   * @defaultValue `"primary"`
   */
  variant: ProgressVariant;

  /**
   * NOTE: This should not be changed. See {@link value} for a reason why and
   * alternatives.
   *
   * @readonly
   * @defaultValue `0`
   */
  min: number;

  /**
   * NOTE: This should not be changed. See {@link value} for a reason why and
   * alternatives.
   *
   * @readonly
   * @defaultValue `100`
   */
  max: number;

  /**
   * If the `value` attribute is not provided, the progressbar will be
   * considered indeterminate and play an infinite animation while visible and
   * rendered.
   *
   * The {@link min} and {@link max} properties should generally not be changed
   * to support different range of values. Instead the `value` should just
   * reflect the current percentage between whatever custom range you are using
   * instead. The current percentage can be reflected to whatever display value
   * instead. This allows the progress bar to be styled correctly and keeps
   * things
   *
   * @example Custom Range
```ts
const min = -3;
const max = 6;
const currentValue = 3;
const percentage = getPercentage({ min, max, value: currentValue });
const value = percentage * 100;

progress.setProperty("value", value);
```
   *
   * @defaultValue `this.min`
   */
  value: number;

  /**
   * Set this to `true` to pause the indeterminate animation.
   *
   * @defaultValue `false`
   */
  paused: boolean;

  /**
   * Set this to `true` to reverse the direction of the progress bar.
   *
   * @defaultValue `false`
   */
  reversed: boolean;

  /**
   * Set this to `true` to remove the default gap between the active and
   * inactive tracks. The gap can also be modified by updating the
   * `--mwc-progress-gap` var.
   *
   * @defaultValue `false`
   */
  disableGap: boolean;

  /**
   * The default behavior is to transition to the next {@link value} but
   * sometimes it updates too quickly before the transition completes or at
   * weird intervals that make it look jumpy. This can sometimes be fixed by
   * updating the `--mwc-progress-transition-duration` var, but can be fully
   * removed by setting this to `true`.
   *
   * @defaultValue `false`
   */
  disableTransition: boolean;
}
