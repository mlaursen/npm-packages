import { type Result } from "postcss";

import {
  type CompileScssModuleOptions as CompileScssModuleOptionsRaw,
  compileScssModule as compileScssModuleRaw,
} from "./compileScssModule.js";
import { defaultNodeLoad } from "./defaultNodeLoad.js";

export interface CompileScssModuleOptions extends Omit<
  CompileScssModuleOptionsRaw,
  "load"
> {
  load?: (filePath: string) => string;
}

/**
 * This can be used to create fake css modules from SCSS code which can be used
 * to create an SCSS editor in the browser.
 *
 * @example Simple Example
 * ```ts
 * import { readFileSync } from "node:fs";
 * import { basename } from "node:path";
 * import { compileScssModule } from "@mlaursen/scss";
 *
 * const filePath = "./src/Example.scss"
 * const code = readFileSync(filePath, 'utf8');
 * const { css } = compileScssModule({
 *   code,
 *   basePath: process.cwd(),
 *   componentName: basename(filePath, ".scss"),
 *
 *   // optional load function. this is the default
 *   // load: (filePath) => readFileSync(filePath, "utf8"),
 * });
 *
 * // do something with css
 * ```
 */
export function compileScssModule(options: CompileScssModuleOptions): Result {
  return compileScssModuleRaw({
    ...options,
    load: options.load ?? defaultNodeLoad,
  });
}
