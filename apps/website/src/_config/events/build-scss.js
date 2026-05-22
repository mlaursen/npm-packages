import { generateFile } from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import { transform } from "lightningcss";
import { readFileSync } from "node:fs";

import {
  DEFAULT_CSS_BROWSERSLIST_TARGETS,
  IS_PRODUCTION,
} from "../constants.js";

export async function buildScss(rootDir) {
  const cwd = process.cwd();
  const mainFilePath = `${rootDir}/assets/scss/global.scss`;
  const main = readFileSync(mainFilePath, "utf8");
  const result = compileScss({
    code: main,
    basePath: cwd,
  });

  let { css } = result;
  if (IS_PRODUCTION) {
    const minified = transform({
      code: Buffer.from(css, "utf8"),
      minify: true,
      filename: mainFilePath,
      targets: DEFAULT_CSS_BROWSERSLIST_TARGETS,
    });

    css = minified.code.toString();
  }

  await generateFile({
    banner: false,
    format: !IS_PRODUCTION,
    contents: css,
    filePath: `${rootDir}/_includes/css/global.css`,
  });
}
