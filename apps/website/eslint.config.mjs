// @ts-check
import { configs, gitignore } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
  gitignore(import.meta.url),
  ...configs.recommended({
    tsconfigRootDir: import.meta.dirname,
  }),
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },
);
