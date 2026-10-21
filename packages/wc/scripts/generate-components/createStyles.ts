import {
  disableLogger,
  enableLogger,
  generateFile,
  logFailure,
} from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import { transform } from "lightningcss";
import { format } from "prettier";

import { createLoadScssFile } from "./createLoadScssFile.js";
import { getStyles } from "./getStyles.js";
import type { CreateStylesOptions } from "./types.js";

export async function createStyles(
  options: CreateStylesOptions,
): Promise<void> {
  const {
    filePath,
    basePath,
    colorScheme,
    sassOptions,
    output,
    targets,
    shortVarNames,
  } = options;

  const code = `
@use "src" as wc;
@use "generate-components/configure";

@use "${filePath}";

@include wc.verify-tokens;
`;

  try {
    const result = compileScss({
      code,
      load: createLoadScssFile({
        colorScheme,
        shortVarNames,
      }),
      basePath,
      sassOptions,
    });

    const development = await format(result.css, {
      parser: "css",
      plugins: ["prettier-plugin-css-order"],
      cssDeclarationSorterOrder: "alphabetical",
    });
    const production = transform({
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

    await generateFile({
      contents: getStyles({ development, production, output }),
      filePath: filePath.replace(".scss", "-styles.ts"),
      fileSize: true,
      format: false,
    });
  } catch (error) {
    enableLogger();
    logFailure(`Unable to compile ${filePath.replace(basePath, "")}.`);
    disableLogger();

    throw error;
  }
}
