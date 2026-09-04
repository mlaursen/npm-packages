import type { OxlintConfig } from "oxlint";

import { TEST_FILES, VITE_MAIN_FILES } from "./constants.js";

export const typescript: OxlintConfig = {
  plugins: ["typescript"],
  rules: {
    "typescript/ban-ts-comment": [
      "error",
      {
        minimumDescriptionLength: 10,
      },
    ],
    "typescript/no-dynamic-delete": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-explicit-any": "error",
    "typescript/no-extraneous-class": "error",
    "typescript/no-invalid-void-type": "error",
    "typescript/no-misused-new": "error",
    "typescript/no-namespace": "error",
    "typescript/no-non-null-asserted-nullish-coalescing": "error",
    "typescript/no-non-null-assertion": "error",
    "typescript/no-require-imports": "error",
    "typescript/no-unnecessary-type-constraint": "error",
    "typescript/no-unsafe-function-type": "error",
    "typescript/no-wrapper-object-types": "error",
    "typescript/prefer-literal-enum-member": "error",
    "typescript/unified-signatures": "error",

    // With grug-far:
    // Search:
    // (?<!export)\stype\s
    // Replace:
    //
    // Flags:
    // -P
    //
    // Then run lint-fix and format
    "typescript/consistent-type-imports": [
      "error",
      {
        fixStyle: "separate-type-imports",
        prefer: "type-imports",
      },
    ],
    "typescript/array-type": [
      "error",
      {
        default: "array",
      },
    ],
    "typescript/consistent-type-definitions": ["error", "interface"],
    "typescript/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
  },
  overrides: [
    {
      files: TEST_FILES,
      rules: {
        "typescript/ban-ts-comment": "off",
        "typescript/explicit-function-return-type": "off",
        "typescript/no-explicit-any": "off",
        "typescript/no-var-requires": "off",
      },
    },
    {
      files: VITE_MAIN_FILES,
      rules: {
        // allow `createRoot(document.getElementById("root")).render(...)` for
        // `vite` without disabling eslint
        "typescript/no-non-null-assertion": "off",
      },
    },
  ],
};
