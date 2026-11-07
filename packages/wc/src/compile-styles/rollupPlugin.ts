import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import { disposeScssCompilers } from "@mlaursen/scss";
import type { Plugin } from "rollup";

import { compileStyles } from "./compileStyles.js";
import { getCompiledTypescriptCode } from "./getCompiledTypescriptCode.js";
import type { CompileStylesPluginOptions } from "./types.js";

const defaultLoad = (filePath: string): string =>
  readFileSync(filePath, "utf8");

/**
 * NOTE: this doesn't really cache files. Might need to be improved later
 */
export function compileStylesRollupPlugin(
  options: CompileStylesPluginOptions = {},
): Plugin {
  const {
    load = defaultLoad,
    output = "flagged",
    filter = /\.scss$/,
    basePath = process.cwd(),
    ...compileOptions
  } = options;

  return {
    name: "@mlaursen/wc/compile-styles-rollup-plugin",

    async transform(code, id, _options) {
      if (!filter.test(id)) {
        return code;
      }

      const result = await compileStyles({
        ...compileOptions,
        basePath,
        filePath: relative(basePath, id),
        load: (filePath) => {
          const absolute = resolve(basePath, filePath);
          if (id === absolute) {
            return code;
          }

          return load(absolute);
        },
      });
      const typescriptCode = getCompiledTypescriptCode({ ...result, output });

      for (const dependency of result.dependencies) {
        this.addWatchFile(dependency);
      }

      return {
        code: typescriptCode,
        map: { mappings: "" },
      };
    },

    async closeWatcher() {
      await disposeScssCompilers();
    },

    async closeBundle() {
      if (!this.meta.watchMode) {
        await disposeScssCompilers();
      }
    },
  };
}
