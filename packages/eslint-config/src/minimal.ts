import { type Linter } from "eslint";
import { testing, type TestFramework } from "./testing.js";
import { typescript, typescriptTypeChecking } from "./typescript.js";
import { unicorn } from "./unicorn.js";

/**
 * @example
 * ```ts
 * import { configs, gitignore } from "@mlaursen/eslint-config";
 * import { defineConfig } from "eslint/config";
 *
 * export default defineConfig([
 *   gitignore(import.meta.url),
 *   ...configs.minimal("jest")
 *   // ...configs.frontend("jest", import.meta.dirname)
 *   // ...configs.frontend("vitest")
 *   // ...configs.frontend("vitest", import.meta.dirname)
 * ]);
 * ```
 */
export const minimal = (
  testFramework: TestFramework,
  tsconfigRootDir?: string
): Linter.Config[] => [
  ...(tsconfigRootDir ? typescriptTypeChecking(tsconfigRootDir) : typescript),
  ...testing(testFramework),
  ...unicorn,
];
