import { type AnyFunction, type DebouncedFunction } from "./types.js";

/**
 * Debounces the provided function to be only called after `duration`
 * milliseconds after the last time it was called.
 *
 * @example Simple Example
 * ```ts
 * const debounced = debounce((search: string): void => {
 *   setSearch(search);
 * }, 150);
 * ```
 *
 * @param fn - The function to debounce
 * @param duration - The number of milliseconds to wait before allowing the
 * function to be called.
 * @returns the debounced function that can also be canceled.
 */
export function debounce<F extends AnyFunction>(
  fn: F,
  duration: number,
): DebouncedFunction<F> {
  let timeout: NodeJS.Timeout | undefined;
  const debounced: DebouncedFunction<F> = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, duration);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
}
