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
