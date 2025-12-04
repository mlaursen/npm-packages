import { type Linter } from "eslint";
import { scripts } from "./scripts.js";
import { testing, type TestOptions } from "./testing.js";
import { typescript, type TypescriptOptions } from "./typescript.js";
import { unicorn } from "./unicorn.js";

export interface RecommendedOptions extends TypescriptOptions, TestOptions {}

/**
 * @example
 * ```ts
 * import { configs, gitignore } from "@mlaursen/eslint-config";
 * import { defineConfig } from "eslint/config";
 *
 * export default defineConfig([
 *   gitignore(import.meta.url),
 *   ...configs.recommended(),
 * ]);
 * ```
 */
export const recommended = (
  options: RecommendedOptions = {}
): readonly Linter.Config[] => {
  return [...typescript(options), ...scripts, ...testing(options), ...unicorn];
};
