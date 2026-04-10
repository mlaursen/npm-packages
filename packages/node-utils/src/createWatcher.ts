import chokidar, { type ChokidarOptions, type FSWatcher } from "chokidar";

import { enableLogger, log } from "./logger.js";

export interface CreateWatcherOptions extends ChokidarOptions {
  watchPath: string;
  onAddOrChange: (path: string) => void;
  onRemove: (path: string) => void;
}

export function createWatcher({
  watchPath,
  onRemove,
  onAddOrChange,
  ...options
}: CreateWatcherOptions): FSWatcher {
  const watcher = chokidar.watch(watchPath, options);

  watcher.on("all", async (eventName, path) => {
    switch (eventName) {
      case "add":
      case "change":
        onAddOrChange(path);
        break;
      case "unlink": {
        onRemove(path);
        break;
      }
    }
  });

  watcher.on("ready", () => {
    enableLogger();
    log("Watching changes...");
  });

  return watcher;
}
