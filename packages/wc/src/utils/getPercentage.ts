export interface GetPercentageOptions {
  /** @defaultValue `0` */
  min?: number;

  /** @defaultValue `100` */
  max?: number;

  /**
   * The current value
   */
  value: number;

  /**
   * Boolean if the min, max, and value options should be validated to make sure
   * they are within the correct range relative to each other.
   *
   * @defaultValue `false`
   */
  validate?: boolean;
}

/**
 * Gets the current percentage based on the min, max, and current value.
 *
 * @returns the percentage that the `value` is between the `min` and `max`
 * values.
 */
export function getPercentage(options: GetPercentageOptions): number {
  const { min = 0, max = 100, value, validate = false } = options;
  if (validate) {
    if (min >= max) {
      throw new RangeError(
        "A range must have the min value less than the max value",
      );
    }

    if (value > max || value < min) {
      throw new RangeError("A value must be between the min and max values");
    }
  }

  const range = max - min;
  const start = value - min;
  const percentage = start / range;
  return Math.max(0, Math.min(Math.abs(percentage), 1));
}
