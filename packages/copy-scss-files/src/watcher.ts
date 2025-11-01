import chokidar from "chokidar";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";

import { copyToDist } from "./copyToDist.js";
import { enableLogger, log } from "./logger.js";

interface WatcherOptions {
  watchPath: string;
  getDistPaths: (path: string) => readonly string[];
}

export function createWatcher({
  watchPath,
  getDistPaths,
}: WatcherOptions): void {
  const watcher = chokidar.watch(watchPath, {
    ignored: (path, stats) => !!stats?.isFile() && !path.endsWith(".scss"),
  });

  watcher.on("all", async (eventName, path) => {
    const paths = getDistPaths(path);

    switch (eventName) {
      case "add":
      case "change":
        void Promise.all(paths.map((distPath) => copyToDist(path, distPath)));
        break;
      case "unlink": {
        void Promise.all(
          paths.map(async (distPath) => {
            if (existsSync(distPath)) {
              await rm(distPath);
              log(`Removed ${distPath}`);
            }
          })
        );
        break;
      }
    }
  });

  watcher.on("ready", () => {
    enableLogger();
    log("Watching changes...");
  });
}
