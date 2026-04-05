import { camelCase } from "./camelCase.js";
import { upperFirst } from "./upperFirst.js";

/**
 * @param s - The string to convert
 * @param separator - an optional separator for each "word" in the string
 */
export const pascalCase = (s: string, separator?: string): string =>
  upperFirst(camelCase(s, separator));
