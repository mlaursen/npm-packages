/**
 * @internal
 * @see {@link https://stackoverflow.com/a/28203456}
 */
export function numberOfDigits(value: number): number;
export function numberOfDigits(value: undefined): undefined;
export function numberOfDigits(value: number | undefined): number | undefined;
export function numberOfDigits(value: number | undefined): number | undefined {
  if (typeof value !== "number") {
    return;
  }

  // oxlint-disable-next-line unicorn/prefer-math-trunc
  return (Math.log10((value ^ (value >> 31)) - (value >> 31)) | 0) + 1;
}
