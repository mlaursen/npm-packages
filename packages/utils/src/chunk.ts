/**
 * Splits in array into multiple chunks which is useful for virtualization,
 * throttling, etc.
 *
 * @example Simple Example
 * ```ts
 * const chunked = chunk([1, 2, 3, 4], 2)
 * // [[1, 2], [3, 4]]
 * ```
 */
export function chunk<T>(list: readonly T[], size: number): readonly T[][] {
  if (size < 1) {
    throw new RangeError("size must be greater than 1");
  }

  const result: T[][] = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }

  return result;
}
