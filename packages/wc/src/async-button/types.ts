import type { OverridableStringUnion } from "@mlaursen/utils";

import type { ButtonProperties } from "../button/types.js";
import type { ProgressVariant } from "../progress/types.js";

export interface AsyncButtonVariantOverrides {}
export type DefaultAsyncButtonVariant =
  | "circular-start"
  | "circular-end"
  | "circular-overlay"
  | "linear-start"
  | "linear-end";
export type AsyncButtonVariant = OverridableStringUnion<
  DefaultAsyncButtonVariant,
  AsyncButtonVariantOverrides
>;

export type AsyncButtonDisabledVariant = "aria-disabled" | "disabled" | null;

export interface AsyncButtonProperties extends ButtonProperties {
  /**
   * Set this to `true` to show the progress bar in the button.
   *
   * @defaultValue `false`
   */
  pending: boolean;

  /**
   * @defaultValue `"circular-overlay"`
   */
  asyncVariant: AsyncButtonVariant;

  /**
   * This controls the disabled state styles for the button.
   * - `"aria-disabled"` - will also automatically set `aria-disabled="true"`
   *   while {@link pending}. While `aria-disabled`, the button gains the
   *   disabled styles, cannot be clicked, but is still focusable.
   * - `"disabled"` - will also automatically set `disabled` while {@link pending}.
   *   While `disabled`, the button becomes disabled and loses focus.
   * - `null` - will not set a disabled state but will still prevent clicks
   *
   * @defaultValue `null`
   */
  asyncDisabledVariant: AsyncButtonDisabledVariant;

  /**
   * The `aria-label` to set on the progress bar.
   *
   * @defaultValue `"Loading"`
   */
  progressLabel: string;

  /**
   * Pass through attribute to set the progress variant
   */
  progressVariant?: ProgressVariant;
}
