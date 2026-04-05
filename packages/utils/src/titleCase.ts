import { upperFirst } from "./upperFirst.js";

/**
 * @param s - The string to convert
 * @param splitter - An optional string or regex to use for splitting
 * @returns the title case string
 */
export const titleCase = (
  s: string,
  splitter: RegExp | string = /(?=[A-Z])/
): string =>
  s.split(splitter).reduce((result, part, i) => {
    return result + (i ? " " : "") + upperFirst(part);
  }, "");
