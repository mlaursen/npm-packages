import { type Linter } from "eslint";
import { jsxA11y } from "./jsxA11y.js";
import { mui } from "./mui.js";
import { react, type ReactOptions } from "./react.js";
import { recommended, type RecommendedOptions } from "./recommended.js";
import { testingLibraryReact } from "./testing-library.js";

export interface RecommendedFrontendOptions
  extends RecommendedOptions, ReactOptions {}

/**
 * @example
 * ```ts
 * import { configs, gitignore } from "@mlaursen/eslint-config";
 * import { defineConfig } from "eslint/config";
 *
 * export default defineConfig([
 *   gitignore(import.meta.url),
 *   ...configs.recommendedFrontend(),
 * ]);
 * ```
 */
export const recommendedFrontend = (
  options: RecommendedFrontendOptions = {}
): readonly Linter.Config[] => {
  return [
    ...recommended(options),
    ...mui,
    ...react(options),
    ...jsxA11y,
    ...testingLibraryReact,
  ];
};
