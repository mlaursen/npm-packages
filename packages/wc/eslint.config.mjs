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
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "never",
          allowObjectTypes: "never",
          allowWithName: ".+Overrides$",
        },
      ],
    },
  },
);
