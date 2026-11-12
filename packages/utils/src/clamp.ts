import type { RangeOptions } from "./types.js";

export interface ClampOptions extends Partial<RangeOptions> {
  /**
   * An optional min value. Ignored when `undefined`
   */
  min?: number;

  /**
   * An optional max value. Ignored when `undefined`
   */
  max?: number;

  /**
   * The value to clamp between an optional `min` and `max` value.
   */
  value: number;
}

/**
 * Clamps a number between an optional min and max value.
 *
 * @returns the updated value
 */
export function clamp(options: Readonly<ClampOptions>): number {
  const { min = Infinity, max = Infinity, value } = options;

  let nextValue = value;
  if (typeof min === "number" && Number.isFinite(min)) {
    nextValue = Math.max(min, nextValue);
  }

  if (typeof max === "number" && Number.isFinite(max)) {
    nextValue = Math.min(max, nextValue);
  }

  return nextValue;
}
