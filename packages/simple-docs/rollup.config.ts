import { nodeResolve } from "@rollup/plugin-node-resolve";
import { type RollupOptions } from "rollup";
import { dts } from "rollup-plugin-dts";
import { defineRollupSwcOption, swc } from "rollup-plugin-swc3";

const external = (id: string): boolean => !/^[./]/.test(id);

export default [
  {
    input: "./src/generate.ts",
    output: {
      file: "./dist/generate.js",
      format: "es",
      sourcemap: true,
    },
    external,
    plugins: [nodeResolve(), swc(defineRollupSwcOption({ sourceMaps: true }))],
  },
  {
    input: "./types/generate.d.ts",
    output: {
      file: "./dist/generate.d.ts",
      sourcemap: true,
    },
    external,
    plugins: [dts()],
  },
  {
    input: "./src/cli.ts",
    output: {
      file: "./dist/cli.js",
      format: "es",
      sourcemap: true,
    },
    external: (id) => external(id) || id.includes("generate"),
    plugins: [nodeResolve(), swc(defineRollupSwcOption({ sourceMaps: true }))],
  },
] satisfies RollupOptions[];
