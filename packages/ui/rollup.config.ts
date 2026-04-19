import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { type RollupOptions } from "rollup";
import summary from "rollup-plugin-summary";
import { swc } from "rollup-plugin-swc3";

const external = (id: string): boolean => !/^[./]/.test(id);
const configs: RollupOptions[] = [
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.js",
      format: "es",
      sourcemap: true,
    },
    external,
    plugins: [
      nodeResolve(),
      swc(),
      // @ts-expect-error bad type definition
      summary(),
    ],
  },
];
if (process.argv.includes("--watch") || process.argv.includes("--dev-server")) {
  while (configs.length > 0) {
    configs.shift();
  }

  configs.push({
    input: "./dev/main.ts",
    output: {
      file: "./dev/main.js",
      format: "es",
    },
    external,
    plugins: [
      json(),
      nodeResolve({
        exportConditions: ["development"],
      }),
      swc(),
      // @ts-expect-error bad type definition
      summary(),
    ],
  });
}
export default configs;
