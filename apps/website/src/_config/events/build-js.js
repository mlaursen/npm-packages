import { basename, dirname } from "node:path";

import { generateFile } from "@mlaursen/node-utils";
import { compileStylesEsbuildPlugin } from "@mlaursen/wc/compile-styles-esbuild-plugin";
import esbuild from "esbuild";
import { glob } from "glob";
import * as sassEmbedded from "sass-embedded";

import { colorScheme, url } from "../../_data/meta.js";
import {
  IS_PRODUCTION,
  NODE_ENV,
  SCRIPTS_DIR,
  SCRIPTS_OUT_DIR,
  SCSS_DIR,
} from "../constants.js";
import { shikiEsbuildPlugin } from "../plugins/shiki.js";

/**
 * @param {string} entryPoint
 * @param {(markdownit: import("markdown-it").MarkdownIt) => void} shiki
 * @return {Promise<string>}
 */
async function build(entryPoint, shiki) {
  const result = await esbuild.build({
    target: "es2020",
    entryPoints: [entryPoint],
    bundle: true,
    minify: IS_PRODUCTION,
    write: false,
    legalComments: "none",
    define: {
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      "process.env.URL": JSON.stringify(url),
      "process.env.SHOW_HOME_NAVIGATION": JSON.stringify(
        process.env.SHOW_HOME_NAVIGATION ?? "",
      ),
    },
    plugins: [
      compileStylesEsbuildPlugin({
        sass: sassEmbedded,
        colorScheme,
        configureFilePath: `${SCSS_DIR}/_configure-website.scss`,
      }),
      shikiEsbuildPlugin(shiki),
    ],
  });

  // prevent nunjucks from attempting to parse `{{`
  // really only an issue when minified
  return result.outputFiles[0]?.text.replaceAll("{{", "{ {") ?? "";
}

/**
 * @param {{ filePath: string; outFileName: string; shiki: (md: import("markdown-it").MarkdownIt) => void }} options
 */
async function compile({ filePath, outFileName, shiki }) {
  const output = await build(filePath, shiki);
  await generateFile({
    format: false,
    banner: false,
    contents: output,
    filePath: `${SCRIPTS_OUT_DIR}/${outFileName}.js`,
  });
}

/**
 * @param {(markdownit: import("markdown-it").MarkdownIt) => void} shiki
 */
export async function buildJs(shiki) {
  const tasks = [
    compile({
      filePath: `${SCRIPTS_DIR}/main.ts`,
      outFileName: "main",
      shiki,
    }),
    compile({
      filePath: `${SCRIPTS_DIR}/404.ts`,
      outFileName: "404",
      shiki,
    }),
  ];

  const pages = await glob("**/index.ts", { cwd: SCRIPTS_DIR });
  for (const filePath of pages) {
    tasks.push(
      compile({
        filePath: `${SCRIPTS_DIR}/${filePath}`,
        outFileName: dirname(filePath),
        shiki,
      }),
    );
  }
  const components = await glob("components/**.ts", {
    cwd: SCRIPTS_DIR,
    ignore: ["**/configure-palette.ts"],
  });
  for (const filePath of components) {
    tasks.push(
      compile({
        filePath: `${SCRIPTS_DIR}/${filePath}`,
        outFileName: basename(filePath, ".ts"),
        shiki,
      }),
    );
  }

  await Promise.all(tasks);
}
