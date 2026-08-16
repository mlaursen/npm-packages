# @mlaursen/oxlint-config

A reusable oxlint config that I use for most projects.

## Installation

```sh
npm install -D oxlint @mlaursen/oxlint-config
```

Then create an `oxlint.config.ts`:

```ts
import { createConfig } from "@mlaursen/eslint-config";
import { defineConfig } from "oxlint";

export default defineConfig(
  // oxlint does not do merging multiple configs together well at the moment,
  // so this helper merges them instead
  createConfig({
    // choose an optional jsx value which defaults to `false`
    jsx: true,
    jsx: "react",
    jsx: "next",

    // choose an optional test framework
    testFramework: "jest",
    testFramework: "vitest",

    // any overrides to merge with the default config
    overrides: {
      rules: {
        // custom global rule overrides
      },

      // custom file level rule overrides
      overrides: [
        {
          files: TEST_FILES,
          rules: {},
        },
      ],
    },
  }),
);
```
