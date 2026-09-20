import { dirname } from "node:path";

import { generateFile } from "@mlaursen/node-utils";
import esbuild from "esbuild";
import { glob } from "glob";

import { url } from "../../_data/meta.js";
import {
  IS_PRODUCTION,
  NODE_ENV,
  SCRIPTS_DIR,
  SCRIPTS_OUT_DIR,
} from "../constants.js";

/**
 * @param {string} entryPoint
 * @return {Promise<void>}
 */
async function build(entryPoint) {
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
    },
  });

  // prevent nunjucks from attempting to parse `{{`
  // really only an issue when minified
  return result.outputFiles[0].text.replaceAll("{{", "{ {");
}

async function compile({ filePath, outFileName }) {
  const output = await build(filePath);
  await generateFile({
    format: false,
    banner: false,
    contents: output,
    filePath: `${SCRIPTS_OUT_DIR}/${outFileName}.js`,
  });
}

export async function buildJs() {
  const tasks = [
    compile({
      filePath: `${SCRIPTS_DIR}/main.ts`,
      outFileName: "main",
    }),
    compile({
      filePath: `${SCRIPTS_DIR}/404.ts`,
      outFileName: "404",
    }),
  ];

  const pages = await glob("**/index.ts", { cwd: SCRIPTS_DIR });
  for (const filePath of pages) {
    tasks.push(
      compile({
        filePath: `${SCRIPTS_DIR}/${filePath}`,
        outFileName: dirname(filePath),
      }),
    );
  }

  await Promise.all(tasks);
}
