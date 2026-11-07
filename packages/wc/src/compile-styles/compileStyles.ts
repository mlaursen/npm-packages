import { fileURLToPath } from "node:url";

import { importOptional } from "@mlaursen/node-utils";
import type * as mlaursenScssModule from "@mlaursen/scss";
import type * as lightningcssModule from "lightningcss";
import type * as sassEmbeddedModule from "sass-embedded";

import { FEATURE_NAME } from "./constants.js";
import { getCompileScssCode } from "./getCompileScssCode.js";
import { getFormatter } from "./getFormatter.js";
import { getLightningCssTargets } from "./getLightningCssTargets.js";
import type { CompileStylesOptions, CompileStylesResult } from "./types.js";

type LightningCSS = typeof lightningcssModule;
type MlaursenSCSS = typeof mlaursenScssModule;
type SassEmbedded = typeof sassEmbeddedModule;

/**
 * This is a util that allows compiling scss and generating lit css templates
 * since I think it's easier writing scss than css in templates. It also allows
 * for all the mixins provided by this library to be used in the custom styles.
 *
 * This is the low level function to just compile the styles into a
 * `development` and `production` version allowing you to generate the file
 * yourself. You can use the `@mlaursen/wc/compile-styles-rollup-plugin` or
 * `@mlaursen/wc/compile-styles-esbuild-plugin` for `rollup` and `esbuild`
 * implementations.
 */
export async function compileStyles(
  options: CompileStylesOptions,
): Promise<CompileStylesResult> {
  const {
    filePath,
    basePath = process.cwd(),
    colorScheme = "light-dark",
    load,
    sassOptions,
    configureFilePath = "./_configure-wc.scss",
    shortVarNames = false,
    verifyTokens = true,
    wcPath = "@mlaursen/wc",
  } = options;

  const [lightningcss, { compileScssAsync }, format, sassEmbedded] =
    await Promise.all([
      importOptional<LightningCSS>("lightningcss", FEATURE_NAME),
      importOptional<MlaursenSCSS>("@mlaursen/scss", FEATURE_NAME),
      getFormatter(options.format),
      importOptional<SassEmbedded>("sass-embedded", "").catch(() => undefined),
    ]);

  const targets = await getLightningCssTargets(lightningcss, options.targets);
  const code = getCompileScssCode({
    code: options.code,
    filePath,
    colorScheme,
    configureFilePath,
    shortVarNames,
    verifyTokens,
    wcPath,
  });

  try {
    const result = await compileScssAsync({
      code,
      load,
      basePath,
      sassOptions,
      sass: sassEmbedded,
    });
    const development = await format(result.css);
    const production = lightningcss
      .transform({
        code: Buffer.from(development, "utf8"),
        minify: true,
        filename: filePath,
        targets,
      })
      .code.toString()
      // this is a dumb one and will need to review later. nunjucks/11ty will
      // try to parse this as a template unless I specifically force raw content
      // so just add a whitespace character to prevent it
      .replaceAll("{#", "{ #");
    const dependencies: string[] = [];
    for (const url of result.loadedUrls) {
      if (url.protocol === "file:") {
        dependencies.push(fileURLToPath(url));
      }
    }

    return {
      ...result,
      development,
      production,
      dependencies,
    };
  } catch (error) {
    throw new Error(`Unable to compile ${filePath.replace(basePath, "")}.`, {
      cause: error,
    });
  }
}
