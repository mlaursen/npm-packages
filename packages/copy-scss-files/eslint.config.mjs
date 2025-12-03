// @ts-check
import { configs, gitignore } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
  gitignore(import.meta.url),
  ...configs.minimal("vitest"),
  {
    rules: {
      // I'm ok with kebab-case-names for these here
      "unicorn/filename-case": "off",
    },
  }
);
