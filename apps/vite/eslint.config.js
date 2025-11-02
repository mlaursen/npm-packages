// @ts-check
import { JSX_FILES, configs, gitignore } from "@mlaursen/eslint-config";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

export default defineConfig(
  gitignore(import.meta.url),
  ...configs.frontend("vitest", true),
  {
    files: JSX_FILES,
    ignores: ["**/test-utils*"],
    extends: [reactRefresh.configs.vite],
  }
);
