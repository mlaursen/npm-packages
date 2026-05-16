import { type CompileResult } from "sass";

import {
  type CompileScssOptions as CompileScssOptionsRaw,
  compileScss as compileScssRaw,
} from "./compileScss.js";
import { defaultNodeLoad } from "./defaultNodeLoad.js";

export interface CompileScssOptions extends Omit<
  CompileScssOptionsRaw,
  "load"
> {
  load?: (filePath: string) => string;
}

/**
 * Allows you to compile scss in either the node or browser environments with
 * some additional setup.
 *
 * @example Node Example
 * ```ts
 * import { readFileSync } from "node:fs";
 * import { compileScss } from "@mlaursen/scss";
 *
 * // start by setting a base path for everything. using process.cwd() is
 * // usually the easiest
 * const basePath = process.cwd();
 * const code = readFileSync("./some/path/to/file.scss", 'utf8');
 *
 * const { css } = compileScss({
 *   code,
 *   // add the base path
 *   basePath,
 *
 *   // optional load function. this is the default
 *   // load: (filePath) => readFileSync(filePath, "utf8"),
 * });
 *
 * // do something with css
 * ```
 *
 */
export function compileScss(options: CompileScssOptions): CompileResult {
  const load = options?.load ?? defaultNodeLoad;

  return compileScssRaw({ ...options, load });
}
