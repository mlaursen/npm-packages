import {
  copyToDist,
  createWatcher,
  enableLogger,
  ensureParentDir,
  log,
} from "@mlaursen/node-utils";
import { glob } from "glob";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";

export interface CopyScssFilesOptions {
  /** @defaultValue `"src"` */
  src?: string;

  /** @defaultValue `"dist"` */
  dist?: string;

  /** @defaultValue `"${src}/**\/*.scss"` */
  pattern?: string;

  /** @defaultValue `process.argv.includes("--watch")` */
  watch?: boolean;

  /**
   * @defaultValue `(path, renameDist) => [renameDist(path)]`
   */
  getDistPaths?: (
    path: string,
    renameDist: (path: string) => string,
  ) => readonly string[];
}

export async function copyScssFiles(
  options: CopyScssFilesOptions,
): Promise<void> {
  const {
    src = "src",
    dist = "dist",
    watch = process.argv.includes("--watch"),
    pattern = `${src}/**/*.scss`,
    getDistPaths = (path, renameDist) => [renameDist(path)],
  } = options;

  const renameDist = (path: string): string => path.replace(src, dist);
  const resolveDistPaths = (path: string): readonly string[] =>
    getDistPaths(path, renameDist);

  if (watch) {
    createWatcher({
      watchPath: src,
      ignored: (path, stats) => !!stats?.isFile() && !path.endsWith(".scss"),
      onRemove(path) {
        void Promise.all(
          resolveDistPaths(path).map(async (distPath) => {
            if (existsSync(distPath)) {
              await rm(distPath);
              log(`Removed ${distPath}`);
            }
          }),
        );
      },
      onAddOrChange(path) {
        void Promise.all(
          resolveDistPaths(path).map((distPath) => copyToDist(path, distPath)),
        );
      },
    });
    return;
  }

  await ensureParentDir(dist);
  const styles = await glob(pattern);
  for (const filePath of styles) {
    const destFiles = resolveDistPaths(filePath);
    for (const destPath of destFiles) {
      await copyToDist(filePath, destPath);
    }
  }

  enableLogger();
  log(`Copied ${styles.length} scss files`);
}
