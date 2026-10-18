export interface ClampOptions {
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
  const { min, max, value } = options;

  let nextValue = value;
  if (typeof min === "number") {
    nextValue = Math.max(min, nextValue);
  }

  if (typeof max === "number") {
    nextValue = Math.min(max, nextValue);
  }

  return nextValue;
}
