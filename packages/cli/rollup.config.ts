import { nodeResolve } from "@rollup/plugin-node-resolve";
import { type RollupOptions } from "rollup";
import { swc } from "rollup-plugin-swc3";

const external = (id: string): boolean => !/^[./]/.test(id);

export default [
  {
    input: "./src/cli.ts",
    output: {
      file: "./dist/cli.mjs",
      format: "es",
      sourcemap: false,
      banner: "#!/usr/bin/env node",
    },
    external,
    plugins: [nodeResolve(), swc()],
  },
] satisfies RollupOptions[];
