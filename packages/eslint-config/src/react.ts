import { type Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import { BASE_NAME, JSX_FILES } from "./constants.js";

export type ReactRefreshConfig = keyof typeof reactRefreshPlugin.configs;

export interface ReactOptions {
  /**
   * Set to one of the `eslint-plugin-react-refresh` config names to enable.
   *
   * @example Vite
   * ```js
   * configs.react({
   *   reactRefresh: "vite",
   * })
   * ```
   *
   * @example Next.js
   * ```js
   * configs.react({
   *   reactRefresh: "next",
   * })
   * ```
   *
   * @example Recommended
   * ```js
   * configs.react({
   *   reactRefresh: "recommended",
   * })
   * ```
   */
  reactRefresh?: ReactRefreshConfig;

  /**
   * Set to `true` to enable the react compiler eslint rules.
   *
   * @defaultValue `false`
   */
  reactCompiler?: boolean;
}

/**
 * @example
 * ```ts
 * import { configs } from "@mlaursen/eslint-config";
 * import { defineConfig } from "eslint/config";
 *
 * export default defineConfig(configs.react());
 *
 * // or with react compiler rules enabled
 * export default defineConfig(configs.react(true));
 * ```
 *
 * Enables:
 * - `eslint-plugin-react` with:
 *   - flat.recommended
 *   - flat['jsx-runtime']
 * - `eslint-plugin-react-hooks` with:
 *   - recommended rules
 *   - compiler rules (if `true` is provided)
 */
export const react = (options: ReactOptions = {}): Linter.Config[] => {
  const { reactRefresh, reactCompiler } = options;

  return [
    {
      ...reactPlugin.configs.flat.recommended,
      name: `${BASE_NAME}/react`,
      files: JSX_FILES,
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        ...reactPlugin.configs.flat.recommended?.rules,
        ...reactPlugin.configs.flat["jsx-runtime"]?.rules,
      },
    },
    {
      ...reactHooksPlugin.configs.flat.recommended,
      name: `${BASE_NAME}/react-hooks`,
      rules: {
        ...(reactCompiler && reactHooksPlugin.configs.flat.recommended.rules),
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": [
          "error",
          {
            additionalHooks: "(useIsomorphicLayoutEffect)",
          },
        ],
      },
    },
    ...(reactRefresh
      ? [
          {
            ...reactRefreshPlugin.configs[reactRefresh],
            name: `${BASE_NAME}/react-refresh`,
            ignores: ["**/test-utils*", "**/test-utils/**"],
          },
        ]
      : []),
  ];
};
