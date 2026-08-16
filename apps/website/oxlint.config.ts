import { createConfig } from "@mlaursen/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig(
  createConfig({
    overrides: {
      rules: {
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            fixStyle: "separate-type-imports",
          },
        ],
      },
    },
  }),
);
