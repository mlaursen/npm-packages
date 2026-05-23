import { generateFile } from "@mlaursen/node-utils";
import esbuild from "esbuild";

import { IS_PRODUCTION, NODE_ENV, ROOT_DIR, WC_ROOT } from "../constants.js";

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

  return result.outputFiles[0].text;
}

export async function buildJs() {
  const outputPath = `${ROOT_DIR}/_includes/scripts/main.js`;
  const output = await build(`${WC_ROOT}/src/index.ts`);
  await generateFile({
    format: false,
    banner: false,
    contents: output,
    filePath: outputPath,
  });
}
