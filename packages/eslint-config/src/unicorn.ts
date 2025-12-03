import { type Linter } from "eslint";
import { BASE_NAME } from "./constants.js";
import eslintPluiginUnicorn from "eslint-plugin-unicorn";

export const unicorn: Linter.Config[] = [
  {
    ...eslintPluiginUnicorn.configs.recommended,
    name: `${BASE_NAME}/unicorn`,
    rules: {
      //  this flags `dist` and `dest` which is annoying
      "unicorn/prevent-abbreviations": "off",

      // I do not like using the default exports from `node:path`, `node:fs`,
      // etc
      "unicorn/import-style": "off",
    },
  },
];
