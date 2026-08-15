import type { OxlintConfig } from "oxlint";

import { DEV_WARNING_PROD_ERROR, TEST_FILES } from "./constants.js";

export const vitest: OxlintConfig = {
  overrides: [
    {
      files: TEST_FILES,
      plugins: ["vitest"],
      rules: {
        "vitest/expect-expect": "error",
        "vitest/no-commented-out-tests": "error",
        "vitest/no-conditional-expect": "error",
        "vitest/no-disabled-tests": DEV_WARNING_PROD_ERROR,
        "vitest/no-focused-tests": DEV_WARNING_PROD_ERROR,
        "vitest/no-identical-title": "error",
        "vitest/no-import-node-test": "error",
        "vitest/no-interpolation-in-snapshots": "error",
        "vitest/no-mocks-import": "error",
        "vitest/no-standalone-expect": "error",
        "vitest/no-unneeded-async-expect-function": "error",
        "vitest/prefer-called-exactly-once-with": "error",
        "vitest/require-local-test-context-for-concurrent-snapshots": "error",
        "vitest/valid-describe-callback": "error",
        "vitest/valid-expect": "error",
        "vitest/valid-expect-in-promise": "error",
        "vitest/valid-title": "error",
        "vitest/no-alias-methods": "error",
        "vitest/no-duplicate-hooks": "error",
        "vitest/prefer-expect-resolves": "error",
        "vitest/prefer-spy-on": "error",

        "vitest/require-to-throw-message": "off",
        "vitest/require-mock-type-parameters": "off",
        "vitest/prefer-snapshot-hint": "off",
      },
    },
  ],
};
