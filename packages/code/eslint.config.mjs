// @ts-check
import { configs, gitignore } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
  gitignore(import.meta.url),
  ...configs.recommendedFrontend({
    reactCompiler: true,
  })
);
