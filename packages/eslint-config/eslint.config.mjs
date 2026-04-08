// @ts-check
import { defineConfig } from "eslint/config";
import { configs, gitignore } from "./dist/index.mjs";

export default defineConfig([
  gitignore(import.meta.url),
  ...configs.recommended({
    tsconfigRootDir: import.meta.dirname,
  }),
]);
