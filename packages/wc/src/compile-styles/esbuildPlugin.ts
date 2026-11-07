import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import { disposeScssCompilers } from "@mlaursen/scss";
import type { PartialMessage, Plugin } from "esbuild";

import { compileStyles } from "./compileStyles.js";
import { getCompiledTypescriptCode } from "./getCompiledTypescriptCode.js";
import type { CompileStylesPluginOptions } from "./types.js";

const defaultLoad = (filePath: string): string =>
  readFileSync(filePath, "utf8");

export function compileStylesEsbuildPlugin(
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
    name: "@mlaursen/wc/compile-styles-esbuild-plugin",

    setup(build) {
      build.onLoad({ filter }, async (args) => {
        if (!filter.test(args.path)) {
          return;
        }

        const code = load(args.path);
        try {
          const result = await compileStyles({
            ...compileOptions,
            basePath,
            filePath: relative(basePath, args.path),
            load: (filePath) => {
              const absolute = resolve(basePath, filePath);
              return absolute === args.path ? code : load(absolute);
            },
          });

          return {
            contents: getCompiledTypescriptCode({ ...result, output }),
            loader: "js",
            watchFiles: [...result.dependencies],
          };
        } catch (error) {
          const errors: PartialMessage[] = [];
          if (error instanceof Error) {
            errors.push({ text: error.message });
            if (error.cause) {
              errors.push({
                text:
                  error.cause instanceof Error
                    ? error.cause.message
                    : String(error.cause),
              });
            }
          } else {
            errors.push({ text: String(error) });
          }

          return {
            errors,
            watchFiles: [args.path],
          };
        }
      });

      build.onDispose(async () => {
        await disposeScssCompilers();
      });
    },
  };
}
