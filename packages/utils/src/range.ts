import { clamp } from "./clamp.js";
import { numberOfDigits } from "./numberOfDigits.js";
import type { RangeOptions, StepRangeOptions } from "./types.js";

/**
 * This is just used for documentation as it's basically `max - min`.
 */
export function getRange(options: RangeOptions): number {
  return options.max - options.min;
}

/**
 * Used to calculate the number of steps in a range.
 */
export function rangeSteps(options: StepRangeOptions): number {
  return Math.abs(getRange(options)) / options.step;
}

export interface SnapToStepOptions extends RangeOptions {
  steps: number;
  value: number;

  /**
   * @defaultValue `getRange({ min, max })`
   */
  range?: number;
}

/**
 * Used to snap a value to the nearest step in a range.
 *
 * @see https://stackoverflow.com/a/13635455
 * @returns the value rounded to the nearest step in the min/max range
 */
export function snapToStep(options: SnapToStepOptions): number {
  const { min, max, value, steps, range = getRange(options) } = options;
  if (min === max) {
    return max;
  }

  const rounded = Math.round(((value - min) * steps) / range) / steps;
  const zeroToOne = Math.min(Math.max(rounded, 0), 1);

  // have to calculate the number of allowed decimal places since decimal
  // precision gets weird:
  // 0.28 * 100 === 28.000000000000004
  const step = range / steps;
  const decimals = Number.isInteger(step)
    ? range % steps
    : numberOfDigits(Number.parseInt(`${step}`.split(".")[1] ?? "0"));

  return clamp({
    min,
    max,
    value: Number.parseFloat((zeroToOne * range + min).toFixed(decimals)),
  });
}

/**
 * Used to get a value within the middle of a range.
 */
export function middleOfRange(options: StepRangeOptions): number {
  const { min, max } = options;
  const currentRange = getRange(options);

  return snapToStep({
    min,
    max,
    range: currentRange,
    steps: rangeSteps(options),
    value: currentRange / 2 + min,
  });
}
