// eslint-disable-next-line no-control-regex
const ASCI_REGEX = /[^\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007F]+/g;

/**
 * @see https://github.com/lodash/lodash/blob/c7c70a7da5172111b99bb45e45532ed034d7b5b9/src/words.ts
 */
export const words = (s: string): readonly string[] =>
  s.match(ASCI_REGEX) || [];
