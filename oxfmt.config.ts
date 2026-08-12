import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 80,
  sortImports: true,
  ignorePatterns: [
    "CHANGELOG.md",
    "**/CHANGELOG.md",
    "**/cli.js",
    "packages/wc/src/**/*-styles.ts",
    "apps/docs/public",
  ],
});
