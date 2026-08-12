import type { OxlintConfig } from "oxlint";

import { DEV_WARNING_PROD_ERROR, TEST_FILES } from "./constants.js";

export const base: OxlintConfig = {
  env: {
    builtin: true,
    es2026: true,
  },
  categories: {
    correctness: "error",
  },

  rules: {
    // You normally do not want `console.{whatever}` in prod but is fine for
    // development in debugging
    "no-console": DEV_WARNING_PROD_ERROR,

    // I want to enforce all statements to require curly braces even if it
    // could be omitted for consistency
    curly: "error",

    eqeqeq: "error",
    "no-else-return": "error",
    "no-empty": "error",

    "no-var": "error",
    "no-use-before-define": "warn",

    "no-alert": "error",
    "no-array-constructor": "error",
    "no-case-declarations": "error",
    "no-fallthrough": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-this-before-super": "error",
    "no-unexpected-multiline": "error",
    "no-useless-constructor": "error",
    "object-shorthand": ["error", "always"],
    "require-yield": "error",
    "use-isnan": "error",
    "valid-typeof": "error",

    // 100% stylistic, but do not allow `a = b = c = "whatever"` / `let a = whatever, b = whatever, c = whatever;`
    // these should be different statements
    "no-multi-assign": "error",
    "no-sequences": "error",

    // use template strings instead
    "no-multi-str": "error",

    // better to use new variables most of the time
    "no-param-reassign": "error",

    // i'd never hit these, but who trusts other people and AI?
    "no-return-assign": "error",
    "no-script-url": "error",
  },
  overrides: [
    {
      files: TEST_FILES,
      rules: {
        // allow tests to be less strict
        "no-empty-function": "off",
      },
    },
  ],
};
