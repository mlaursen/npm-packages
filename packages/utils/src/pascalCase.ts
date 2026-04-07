import { camelCase } from "./camelCase.js";
import { upperFirst } from "./upperFirst.js";

/**
 * @example Simple Example
 * ```ts
 * import { pascalCase } from "@mlaursen/utils";
 *
 * pascalCase("hello-world"); // "HelloWorld"
 * ```
 *
 * @param s - The string to convert
 * @param separator - an optional separator for each "word" in the string
 */
export const pascalCase = (s: string, separator?: string): string =>
  upperFirst(camelCase(s, separator));
