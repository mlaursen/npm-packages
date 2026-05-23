import { generateFile } from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import { glob } from "glob";
import { transform } from "lightningcss";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { colorScheme, fonts } from "../../_data/meta.js";
import {
  DEFAULT_CSS_BROWSERSLIST_TARGETS,
  IS_PRODUCTION,
  SCSS_DIR,
  SCSS_OUT_DIR,
} from "../constants.js";

function getConfigureCode() {
  return `
@use "@mlaursen/wc" as *;

@include configure(
  $palette: (
    color-scheme: ${colorScheme.replace(" ", "-")},
  )
);
`;
}

function getGlobalStyles() {
  return `
@use "@mlaursen/wc" as *;
@use "configure-website";

@layer {
  @include css-reset;

  :root {
    @include variables;
  }
}

@if not ${fonts.google} {
  @font-face {
    font-display: swap;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 100 900;
    src: url("/assets/fonts/Roboto-VariableFont_wdth,wght.ttf")
      format("truetype");
  }

  @font-face {
    font-family: "Roboto";
    font-display: swap;
    font-style: italic;
    font-weight: 100 900;
    src: url("/assets/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf")
      format("truetype");
  }
}
`;
}

async function compile({ cwd, code, filePath, outFileName }) {
  const result = compileScss({
    code,
    basePath: cwd,
    load: (filePath) => {
      if (filePath.endsWith("/configure-website.scss")) {
        return getConfigureCode();
      }

      return readFileSync(filePath, "utf8");
    },
  });

  let { css } = result;
  if (IS_PRODUCTION) {
    const minified = transform({
      code: Buffer.from(css, "utf8"),
      minify: true,
      filename: filePath,
      targets: DEFAULT_CSS_BROWSERSLIST_TARGETS,
    });

    css = minified.code.toString();
  }

  await generateFile({
    banner: false,
    format: !IS_PRODUCTION,
    contents: css,
    filePath: `${SCSS_OUT_DIR}/${outFileName}.css`,
  });
}

async function readCompile({ cwd, filePath, outFileName }) {
  const code = await readFile(filePath, "utf8");

  return compile({ code, cwd, filePath, outFileName });
}

export async function buildScss() {
  const cwd = process.cwd();

  const tasks = [
    compile({
      cwd,
      code: getGlobalStyles(),
      filePath: `${SCSS_DIR}/global.scss`,
      outFileName: "global",
    }),
  ];

  const globals = await glob("**/*.scss", {
    cwd: SCSS_DIR,
  });
  for (const filePath of globals) {
    tasks.push(
      readCompile({
        cwd,
        filePath: `${SCSS_DIR}/${filePath}`,
        outFileName: filePath.replace(".scss", ""),
      }),
    );
  }

  await Promise.all(tasks);
}
