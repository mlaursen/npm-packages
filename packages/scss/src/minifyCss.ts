import autoprefixer from "autoprefixer";
import cssnano, { type Options } from "cssnano";
import cssnanoPresetDefault from "cssnano-preset-default";
import postcss, { type ProcessOptions, type Result } from "postcss";

export interface MinifyCssOptions extends Pick<Options, "plugins"> {
  css: string;

  /** @see {@link ProcessOptions.from} */
  from: string;
  presetOptions?: Parameters<typeof cssnanoPresetDefault>[0];
  processOptions?: ProcessOptions | undefined;
}

/**
 * @example Simple Example
 * ```ts
 * import { readFileSync, writeFileSync } from "node:fs"
 * import { compileScss, minifyCss } from "@mlaursen/scss";
 *
 * const filePath = "./some/path/to/file.scss"
 * const code = readFileSync(filePath, 'utf8');
 *
 * const compileResult = compileScss({
 *   code,
 *   load: (filePath) => readFileSync(filePath, "utf8"),
 *   basePath: process.cwd(),
 * });
 *
 * const minifyResult = minifyCss({
 *   css: compileResult.css
 *   from: filePath,
 * });
 *
 * writeFileSync("example.min.css", minifyResult.css);
 * ```
 *
 * @see {@link compileScss}
 *
 */
export async function minifyCss(options: MinifyCssOptions): Promise<Result> {
  const {
    css,
    from,
    plugins = [],
    presetOptions,
    processOptions = {},
  } = options;
  return await postcss([
    cssnano({
      preset: cssnanoPresetDefault({
        env: "production",
        ...presetOptions,
      }),
      plugins: [autoprefixer, ...plugins],
    }),
  ]).process(css, { from, ...processOptions });
}
