import { nodeResolve } from "@rollup/plugin-node-resolve";
import { type RollupOptions } from "rollup";
import summary from "rollup-plugin-summary";
import { swc } from "rollup-plugin-swc3";

const swcPlugin = swc({
  swcrc: false,
  exclude: ["__tests__"],
  jsc: {
    parser: {
      syntax: "typescript",
      decorators: true,
    },
    transform: {
      useDefineForClassFields: false,
    },
    target: "es2021",
  },
  sourceMaps: true,
});

const external = (id: string): boolean => !/^[./]/.test(id);
export default [
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
      swcPlugin,
      // @ts-expect-error bad type definition
      summary(),
    ],
  },
] satisfies RollupOptions[];
