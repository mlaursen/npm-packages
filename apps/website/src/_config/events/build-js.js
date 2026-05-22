import { generateFile } from "@mlaursen/node-utils";
import esbuild from "esbuild";

async function build(entryPoint) {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const result = await esbuild.build({
    target: "es2020",
    entryPoints: [entryPoint],
    bundle: true,
    minify: nodeEnv === "production",
    write: false,
    legalComments: "none",
    define: {
      "process.env.NODE_ENV": JSON.stringify(nodeEnv),
    },
  });

  return result.outputFiles[0].text;
}

export async function buildJs(rootDir) {
  const outputPath = `${rootDir}/_includes/scripts/main.js`;
  const output = await build("../../packages/wc/src/index.ts");
  await generateFile({
    format: false,
    banner: false,
    contents: output,
    filePath: outputPath,
  });
}
