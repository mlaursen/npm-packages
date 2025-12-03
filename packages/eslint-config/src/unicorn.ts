import { type Linter } from "eslint";
import { BASE_NAME, TEST_FILES, VITE_MAIN_FILES } from "./constants.js";
import eslintPluiginUnicorn from "eslint-plugin-unicorn";

export const unicorn: Linter.Config[] = [
  {
    ...eslintPluiginUnicorn.configs.recommended,
    name: `${BASE_NAME}/unicorn`,
    rules: {
      ...eslintPluiginUnicorn.configs.recommended.rules,

      //  this flags `dist` and `dest` which is annoying
      "unicorn/prevent-abbreviations": "off",

      // I do not like using the default exports from `node:path`, `node:fs`,
      // etc
      "unicorn/import-style": "off",

      // I want PascalCase for React components/classes, camelCase for others.
      // Don't care enough to enforce through a rule and don't think it's
      // possible.
      "unicorn/filename-case": "off",

      // prettier instead
      "unicorn/empty-brace-spaces": "off",

      // I like `null`
      "unicorn/no-null": "off",

      // the description is incorrect since it attempts converting multi-line
      // statements to ternary which is awful:
      //
      // > This rule enforces the use of ternary expressions over 'simple'
      // > if-else statements, where 'simple' means the consequent and alternate
      // > are each one line and have the same basic type and form.
      "unicorn/prefer-ternary": "off",

      // I don't care about adding braces to switch cases. I'd prefer
      // `["error", "avoid"]` more though since it only adds them when needed.
      "unicorn/switch-case-braces": "off",
    },
  },
  {
    name: `${BASE_NAME}/unicorn/vite`,
    files: VITE_MAIN_FILES,
    rules: {
      // allow `createRoot(document.getElementById("root")).render(...)` for
      // `vite` without disabling eslint
      "unicorn/prefer-query-selector": "off",
    },
  },
  {
    name: `${BASE_NAME}/unicorn/testing`,
    files: TEST_FILES,
    rules: {
      // allow functions to be scoped to tests
      "unicorn/consistent-function-scoping": "off",
    },
  },
];
