import { type CompileScssOptions } from "@mlaursen/scss";
import { type Targets } from "lightningcss";

import type { ColorScheme } from "../../src/palette/types.js";

export type CreateStylesOutput = "minified" | "flagged";

export interface ConfigureScssOptions {
  /**
   * @defaultValue `light-dark`
   */
  colorScheme?: ColorScheme;

  /**
   * @defaultValue `false`
   */
  shortVarNames?: boolean;
}

export interface GenerateComponentsScssOptions extends ConfigureScssOptions {
  /**
   * @defaultValue `process.cwd()`
   */
  basePath?: string;

  /**
   * @defaultValue `"flagged"`
   */
  output?: CreateStylesOutput;

  /**
   * @defaultValue `DEFAULT_CSS_BROWSERSLIST_TARGETS`
   */
  targets?: Targets;

  quiet?: boolean;
  sassOptions?: CompileScssOptions["sassOptions"];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GenerateComponentsOptions extends GenerateComponentsScssOptions {}

export interface CreateStylesOptions extends Required<GenerateComponentsScssOptions> {
  filePath: string;
}
