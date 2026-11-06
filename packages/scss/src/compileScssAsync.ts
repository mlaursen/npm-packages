import { type CompileResult, type StringOptions } from "sass";

import type { CompileScssOptions } from "./compileScss.node.js";
import { createScssImporter } from "./createScssImporter.js";
import { defaultNodeLoad } from "./defaultNodeLoad.js";

interface SassAsyncCompiler {
  dispose(): Promise<void>;
  compileStringAsync(source: string, options: unknown): Promise<CompileResult>;
}

export interface SassAsyncImplementation {
  initAsyncCompiler(): Promise<SassAsyncCompiler>;
}

const compilers = new Map<
  SassAsyncImplementation,
  Promise<SassAsyncCompiler>
>();

async function getCompiler(
  implementation: SassAsyncImplementation | undefined,
): Promise<SassAsyncCompiler> {
  const sass = implementation ?? (await import("sass"));

  const cached = compilers.get(sass);
  if (cached) {
    return cached;
  }

  const compiler = sass.initAsyncCompiler();
  compilers.set(sass, compiler);
  compiler.catch(() => compilers.delete(sass));
  return compiler;
}

export interface CompileScssAsyncOptions extends Omit<
  CompileScssOptions,
  "sassOptions"
> {
  sass?: SassAsyncImplementation;
  sassOptions?: StringOptions<"async">;
}

export async function compileScssAsync(
  options: CompileScssAsyncOptions,
): Promise<CompileResult> {
  const { code, load = defaultNodeLoad, basePath, sass, sassOptions } = options;

  const compiler = await getCompiler(sass);

  return compiler.compileStringAsync(code, {
    ...sassOptions,
    importers: [
      createScssImporter({ load, basePath }),
      ...(sassOptions?.importers ?? []),
    ],
  });
}

export async function disposeScssCompilers(): Promise<void> {
  const pending = [...compilers.values()];
  compilers.clear();

  await Promise.all(
    pending.map(async (pendingCompiler) => {
      const compiler = await pendingCompiler;
      await compiler.dispose();
    }),
  );
}
