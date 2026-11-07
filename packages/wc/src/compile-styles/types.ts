import type { CompileScssAsyncOptions } from "@mlaursen/scss";
import type { Targets } from "lightningcss";
import type { CompileResult } from "sass-embedded";

import type { ColorScheme } from "../palette/types.js";

export interface ConfigureScssOptions {
  /**
   * The current file that should be compiled.
   */
  filePath: string;

  /**
   * Automatically call `@include wc.verify-tokens;` in the default template.
   *
   * @defaultValue `true`
   */
  verifyTokens?: boolean;

  /**
   * @defaultValue `light-dark`
   */
  colorScheme?: ColorScheme;

  /**
   * @defaultValue `false`
   */
  shortVarNames?: boolean;

  /**
   * This is the main file for configuring `@mlaursen/wc` and used
   * for the default code template.
   *
   * @defaultValue `${basePath}/_configure-wc.scss`
   */
  configureFilePath?: string;

  /**
   * The main module path for `@mlaursen/wc`. This is just used for the default
   * code template.
   *
   * @defaultValue `"@mlaursen/wc"`
   */
  wcPath?: string;
}

export type FormatDevelopmentCSS = (developmentCss: string) => Promise<string>;

export interface CompileStylesOptions
  extends
    ConfigureScssOptions,
    Omit<CompileScssAsyncOptions, "basePath" | "code"> {
  code?: string | ((options: Readonly<ConfigureScssOptions>) => string);

  /**
   * This is used to resolve all the Sass files.
   *
   * @see {@link CompileScssOptions.basePath}
   * @defaultValue `process.cwd()`
   * @override
   */
  basePath?: string;

  /**
   * The `lightningcss` transform targets for browser support.
   *
   * The default value is:
   * ```ts
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

browserslistToTargets(
  browserslist("last 2 versions and not dead and > 0.5%"),
);
```
   */
  targets?: Targets;

  /**
   * An optional function to format the development css. The default behavior
   * is to check if `postcss` and `css-declaration-sorter` have been installed
   * and then sort properties alphabetically. If they don't exist, just return
   * the normal sass development output.
   */
  format?: FormatDevelopmentCSS;
}

export interface CompileStylesResult extends CompileResult {
  production: string;
  development: string;
  dependencies: readonly string[];
}

/**
 * When `"minified"`, only the minified production version will be returned.
 *
 * When `"flagged"`, the default export will be something like:
 * ```ts
 * export default process.env.NODE_ENV === "production"
 *   ? css`...minified...`
 *   : css`...full css...`;
 *
 * ```
 */
export type CompileStylesOutput = "minified" | "flagged";

export interface CompileStylesPluginOptions extends Omit<
  CompileStylesOptions,
  "filePath"
> {
  /**
   * @defaultValue `"minified"`
   */
  output?: CompileStylesOutput;

  /**
   * @defaultValue `/\.scss$/`
   */
  filter?: RegExp;
}
