import { type Linter } from "eslint";
import { jsxA11y } from "./jsxA11y.js";
import { minimal } from "./minimal.js";
import { react } from "./react.js";
import { testingLibraryReact } from "./testing-library.js";
import { type TestFramework } from "./testing.js";

interface FrontendOptions {
  testFramework: TestFramework;
  reactCompiler?: boolean;
  tsconfigRootDir?: string;
}

const _frontend = (options: FrontendOptions): Linter.Config[] => {
  const { testFramework, reactCompiler, tsconfigRootDir } = options;
  return [
    ...minimal(testFramework, tsconfigRootDir),
    ...react(reactCompiler),
    ...jsxA11y,
    ...testingLibraryReact,
  ];
};

/**
 * @example
 * ```ts
 * import { configs, gitignore } from "@mlaursen/eslint-config";
 * import { defineConfig } from "eslint/config";
 *
 * export default defineConfig([
 *   gitignore(import.meta.url),
 *   ...configs.frontend("jest")
 *   // ...configs.frontend("jest", true)
 *   // ...configs.frontend("vitest")
 *   // ...configs.frontend("vitest", true)
 * ]);
 * ```
 */
export const frontend = (
  testFramework: TestFramework,
  reactCompiler?: boolean
): Linter.Config[] => _frontend({ testFramework, reactCompiler });

/**
 * @example
 * ```ts
 * import { configs, gitignore } from "@mlaursen/eslint-config";
 * import { defineConfig } from "eslint/config";
 *
 * export default defineConfig([
 *   gitignore(import.meta.url),
 *   ...configs.frontendTypeChecking(import.meta.dirname, "jest")
 *   // ...configs.frontendTypeChecking(import.meta.dirname, "jest", true)
 *   // ...configs.frontendTypeChecking(import.meta.dirname, "vitest"),
 *   // ...configs.frontendTypeChecking(import.meta.dirname, "vitest", true),
 * ]);
 * ```
 */
export const frontendTypeChecking = (
  tsconfigRootDir: string,
  testFramework: TestFramework,
  reactCompiler?: boolean
): Linter.Config[] =>
  _frontend({ testFramework, reactCompiler, tsconfigRootDir });
