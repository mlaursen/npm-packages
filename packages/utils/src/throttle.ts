import { type AnyFunction, type ThrottledFunction } from "./types.js";

/**
 * Throttles a function so that it is only called once every x milliseconds.
 *
 * @example Simple Example
 * ```ts
 * const throttled = throttle((search: string): void => {
 *   setSearch(search);
 * }, 150);
 * ```
 *
 * @param fn - The function to throttle
 * @param wait - The number of milliseconds to wait before the function can be
 * called again.
 * @returns the throttled function that can also be canceled.
 */
export function throttle<F extends AnyFunction>(
  fn: F,
  wait: number,
): ThrottledFunction<F> {
  let args: Parameters<F>;
  let result: ReturnType<F>;
  let timeout: NodeJS.Timeout | undefined;
  let lastCalledTime = 0;

  const throttled: ThrottledFunction<F> = (...nextArgs) => {
    args = nextArgs;

    const now = Date.now();
    const remaining = wait - (now - lastCalledTime);
    if (remaining <= 0 || remaining > wait) {
      lastCalledTime = now;
      result = fn(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCalledTime = Date.now();
        timeout = undefined;
        result = fn(...args);
      }, remaining);
    }

    return result;
  };
  throttled.cancel = () => {
    clearTimeout(timeout);
  };

  return throttled;
}
