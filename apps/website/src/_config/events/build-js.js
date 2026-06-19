import { generateFile } from "@mlaursen/node-utils";
import esbuild from "esbuild";
import { glob } from "glob";

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
  ];
  const globals = await glob("**/*.ts", {
    cwd: SCRIPTS_DIR,
    ignore: "**/main.ts",
  });
  for (const filePath of globals) {
    tasks.push(
      compile({
        filePath: `${SCRIPTS_DIR}/${filePath}`,
        outFileName: filePath.replace(".ts", ""),
      }),
    );
  }

  await Promise.all(tasks);
}
