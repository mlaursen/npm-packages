import type { ChildProcess } from "node:child_process";
import { execSync, spawn } from "node:child_process";
import { glob } from "node:fs/promises";
import { basename } from "node:path";

import { getGitRoot, touch } from "@mlaursen/node-utils";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import type { Plugin, RollupOptions } from "rollup";
import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import { swc } from "rollup-plugin-swc3";

import { compileStylesRollupPlugin } from "./src/compile-styles/rollupPlugin.js";

const mainIndexFile = "./src/index.ts";
const external = (id: string): boolean => !/^[./]/.test(id);
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

const WATCHING_REGEXP = /Watching for file changes/;

function setupWatcher(command: string): {
  watcher: ChildProcess;
  promise: Promise<void>;
} {
  // oxlint-disable-next-line typescript/no-invalid-void-type
  const { promise, resolve } = Promise.withResolvers<void>();
  const watcher = spawn("pnpm", [command], {
    stdio: ["inherit", "pipe", "inherit"],
  });

  let resolved = false;
  watcher.stdout?.on("data", (chunk: Buffer) => {
    process.stdout.write(chunk);
    if (!resolved && WATCHING_REGEXP.test(chunk.toString())) {
      resolved = true;
      resolve();
    }
  });

  return { promise, watcher };
}

function touchWebsitePlugin(): Plugin {
  const gitRoot = getGitRoot();
  return {
    name: "touch-website-plugin",
    writeBundle() {
      if (this.meta.watchMode) {
        touch(`${gitRoot}/apps/website/src/index.njk`);
      }
    },
  };
}

function generateTypesPlugin(): Plugin {
  let watcher: ChildProcess | undefined;
  let promise: Promise<void> | undefined;
  return {
    name: "generate-types-plugin",
    buildStart() {
      if (!this.meta.watchMode) {
        execSync("pnpm build-types");
        return;
      }
      if (watcher) {
        return;
      }

      ({ watcher, promise } = setupWatcher("build-types-watch"));
      return promise;
    },
    closeWatcher() {
      watcher?.kill();
    },
  };
}

async function getDefineFiles(): Promise<readonly string[]> {
  const files: string[] = [];
  for await (const entry of glob("src/**/define.ts")) {
    files.push(entry);
  }

  return files;
}

async function getStylesFiles(): Promise<Record<string, string>> {
  const files: Record<string, string> = {};
  for await (const entry of glob("src/**/*-styles.ts")) {
    const withoutSrc = basename(entry, ".ts");
    files[withoutSrc] = "./" + entry;
  }

  return files;
}

export default defineConfig(async (): Promise<RollupOptions[]> => {
  const tsInput: Record<string, string> = {
    index: mainIndexFile,
    "compile-styles": "./src/compile-styles/index.ts",
    "compile-styles-rollup-plugin": "./src/compile-styles/rollupPlugin.ts",
    "compile-styles-esbuild-plugin": "./src/compile-styles/esbuildPlugin.ts",
    ...(await getStylesFiles()),
  };
  const dtsInput: Record<string, string> = {
    index: "./types/index.d.ts",
    "compile-styles": "./types/compile-styles/index.d.ts",
    "compile-styles-rollup-plugin": "./types/compile-styles/rollupPlugin.d.ts",
    "compile-styles-esbuild-plugin":
      "./types/compile-styles/esbuildPlugin.d.ts",
  };

  const defineFiles = await getDefineFiles();
  for (const defineFile of defineFiles) {
    const withoutExt = defineFile.replace(".ts", "");
    const withoutSrc = withoutExt.replace("src/", "");
    tsInput[withoutSrc] = defineFile;

    const dts = withoutExt.replace("src/", "types/");
    dtsInput[dts.replace("types/", "")] = "./" + dts + ".d.ts";
  }

  return [
    {
      input: tsInput,
      output: {
        dir: "./dist",
        format: "es",
        entryFileNames: "[name].js",
        // this is the fix for having empty import statements for files
        hoistTransitiveImports: false,
      },
      external,
      plugins: [
        compileStylesRollupPlugin({
          wcPath: "./src",
          sassOptions: { sourceMap: true },
        }),
        nodeResolve(),
        swcPlugin,
        touchWebsitePlugin(),
      ],
    },
    {
      // bundled type definitions
      input: dtsInput,
      output: {
        dir: "./dist",
        format: "es",
        entryFileNames: "[name].d.ts",
      },
      external,
      plugins: [generateTypesPlugin(), dts()],
    },
  ];
});
