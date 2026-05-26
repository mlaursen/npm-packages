import {
  type CreateWatcherOptions,
  createWatcher,
  disableLogger,
  enableLogger,
  getGitRoot,
  log,
  logFailure,
  logPending,
  touch,
} from "@mlaursen/node-utils";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";

import { DEFAULT_CSS_BROWSERSLIST_TARGETS } from "./constants.js";
import { createStyles } from "./createStyles.js";
import type {
  CreateStylesOptions,
  GenerateComponentsScssOptions,
} from "./types.js";

const isPartial = (filePath: string): boolean => filePath.includes("_");
const isIgnored: Required<CreateWatcherOptions>["ignored"] = (path, stats) =>
  !!stats?.isFile() && !/\.scss$/.test(path);

const gitRoot = getGitRoot();

async function createStylesWhileWatching(
  options: CreateStylesOptions,
): Promise<void> {
  try {
    await createStyles(options);
    // touch this file so that eleventy will rebuild
    touch(`${gitRoot}/apps/website/src/pages/index.njk`);
  } catch (error) {
    if (error instanceof Error) {
      enableLogger();
      logFailure(error.message);
      disableLogger();
    } else {
      throw error;
    }
  }
}

export function watcher(options: GenerateComponentsScssOptions = {}): void {
  const {
    quiet = false,
    basePath = process.cwd(),
    output = "flagged",
    colorScheme = "light-dark",
    sassOptions = {},
    targets = DEFAULT_CSS_BROWSERSLIST_TARGETS,
    shortVarNames = output === "minified",
  } = options;

  enableLogger();
  logPending(`Using ${colorScheme} color scheme for styles`);
  disableLogger();

  const rebuild = new Set<string>();
  createWatcher({
    quiet,
    watchPath: "src",
    ignored: isIgnored,
    onRemove: async (filePath) => {
      log(`Removed ${filePath}`);
      rebuild.delete(filePath);
      if (existsSync(filePath)) {
        await rm(filePath, { recursive: true });
      }
    },
    onAddOrChange: async (filePath, ready) => {
      if (isPartial(filePath)) {
        if (ready) {
          const promises: Promise<void>[] = [];
          for (const file of rebuild) {
            promises.push(
              createStylesWhileWatching({
                quiet,
                colorScheme,
                filePath: file,
                basePath,
                output,
                sassOptions,
                targets,
                shortVarNames,
              }),
            );
          }

          await Promise.all(promises);
        }
        return;
      }

      rebuild.add(filePath);
      await createStylesWhileWatching({
        quiet,
        colorScheme,
        filePath,
        basePath,
        output,
        sassOptions,
        targets,
        shortVarNames,
      });
    },
  });
}
