import { readFileSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { basename } from "node:path";

import { generateFile, log, logFailure } from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import { glob } from "glob";
import { transform } from "lightningcss";

import { colorScheme, fonts } from "../../_data/meta.js";
import {
  DEFAULT_CSS_BROWSERSLIST_TARGETS,
  DISABLE_FOCUS_ANIMATION,
  IS_PRODUCTION,
  SCSS_DIR,
  SCSS_OUT_DIR,
} from "../constants.js";
import { setShikiCssFile } from "../plugins/shiki.js";
import { getContentHash } from "../utils/getContentHash.js";

function getGlobalStyles() {
  if (DISABLE_FOCUS_ANIMATION) {
    log("[SETTINGS] Disabling the default focus animation");
  }

  if (!fonts.google) {
    log("[SETTINGS] Enabling self hosted fonts");
  }

  return `
@use "@mlaursen/wc" as *;
@use "configure-website";

@layer {
  @include css-reset;

  :root {
    @include variables;
    @if ${DISABLE_FOCUS_ANIMATION} {
      @include disable-focus-animation;
    }
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
    load: (currentFilePath) => {
      const isConfigureWebsite = currentFilePath.includes("_configure-website");
      const filePath = isConfigureWebsite
        ? `${SCSS_DIR}/_configure-website.scss`
        : currentFilePath;

      let code = readFileSync(filePath, "utf8");
      if (isConfigureWebsite) {
        code = code.replace("light-dark", colorScheme.replace(" ", "-"));
      }

      if (code.includes('@use "@mlaursen/wc"')) {
        if (!code.includes('@use "@mlaursen/wc" as *;')) {
          logFailure(
            `${filePath} must be updated to include @mlaursen/wc as *;`,
          );
        }

        if (!code.includes("@include verify-tokens;")) {
          code += "\n@include verify-tokens;\n";
        }
      }

      return code;
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

  let cssFileName = `${SCSS_OUT_DIR}/${outFileName}.css`;
  if (cssFileName.endsWith("shiki.css")) {
    const hash = getContentHash(css);
    cssFileName = cssFileName.replace(".css", `.${hash}.css`);
    setShikiCssFile(basename(cssFileName));
  }

  await generateFile({
    banner: false,
    format: !IS_PRODUCTION,
    contents: css,
    filePath: cssFileName,
  });
}

async function readCompile({ cwd, filePath, outFileName }) {
  const code = await readFile(filePath, "utf8");

  return compile({ code, cwd, filePath, outFileName });
}

async function removeShikiFiles() {
  const shiki = await glob("shiki.*", {
    cwd: SCSS_OUT_DIR,
  });
  await Promise.all(
    shiki.map((file) => rm(`${SCSS_OUT_DIR}/${file}`, { force: true })),
  );
  setShikiCssFile("");
}

export async function buildScss() {
  const cwd = process.cwd();
  await removeShikiFiles();

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
