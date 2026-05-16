import { nodeResolve } from "@rollup/plugin-node-resolve";
import { type RollupOptions } from "rollup";
import { dts } from "rollup-plugin-dts";
import { defineRollupSwcOption, swc } from "rollup-plugin-swc3";

const external = (id: string): boolean => !/^[./]/.test(id);

export default ["browser", "node"].flatMap(
  (name) =>
    [
      {
        input: `./src/${name}.ts`,
        output: {
          file: `./dist/${name}.mjs`,
          format: "es",
          sourcemap: true,
        },
        external,
        plugins: [
          nodeResolve(),
          swc(defineRollupSwcOption({ sourceMaps: true })),
        ],
      },
      {
        input: `./types/${name}.d.ts`,
        output: {
          file: `./dist/${name}.d.ts`,
          sourcemap: true,
        },
        external,
        plugins: [dts()],
      },
    ] satisfies RollupOptions[],
);
