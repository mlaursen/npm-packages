import { clamp } from "./clamp.js";

export interface LoopOptions {
  /**
   * The current value that should be modified.
   */
  value: number;

  /**
   * An optional `min` value that can be used before looping to the `max` value.
   *
   * @defaultValue `0`
   */
  min?: number;

  /**
   * The max number that can be used before looping to the `min` value.
   *
   * @defaultValue `100`
   */
  max?: number;

  /**
   * Boolean if the `value` should be incremented or decremented by `1`.
   */
  increment: boolean;

  /**
   * If this is `true` the value is just clamped between the min and max
   * instead of looping.
   *
   * @defaultValue `false`
   */
  clamp?: boolean;
}

/**
 * A small util that is used to increment or decrement a number until it reaches
 * the max value or -1. When that happens, it will loop around to 0 or the max
 * value respectively. This does not work for different increment numbers or any
 * values below 0 for now.
 *
 * @param options - {@link LoopOptions}
 */
export function loop(options: LoopOptions): number {
  const { value, min = 0, max = 100, increment } = options;

  if (options.clamp) {
    return clamp({ min, max, value });
  }

  let next = value + (increment ? 1 : -1);
  if (next > max) {
    next = min;
  } else if (next < min) {
    next = max;
  }

  return next;
}
