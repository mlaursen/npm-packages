import { type KebabCase } from "./types.js";

/**
 * @example Simple Example
 * ```ts
 * import { kebabCase } from "@mlaursen/utils";
 *
 * kebabCase("HelloWorld"); // "hello-world"
 * ```
 *
 * @param s - The string to convert
 */
export const kebabCase = <S extends string>(s: S): KebabCase<S> =>
  s.split(/(?=[A-Z])/).reduce((result, part, i) => {
    return result + (i ? "-" : "") + part.toLowerCase();
  }, "") as KebabCase<S>;
