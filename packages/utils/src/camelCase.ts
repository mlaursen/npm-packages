import { upperFirst } from "./upperFirst.js";
import { words } from "./words.js";

/**
 * @see https://github.com/lodash/lodash/blob/c7c70a7da5172111b99bb45e45532ed034d7b5b9/src/camelCase.ts
 *
 * @param s - The string to convert to camel case
 * @param separator - An optional separator for each "word" in the string
 */
export const camelCase = (s: string, separator = ""): string =>
  // eslint-disable-next-line unicorn/no-array-reduce
  words(s).reduce((result, word, i) => {
    const w = word.toLowerCase();
    return result + (i ? separator : "") + (i ? upperFirst(w) : w);
  }, "");
