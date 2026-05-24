import chokidar, { type ChokidarOptions, type FSWatcher } from "chokidar";

import { disableLogger, enableLogger, log } from "./logger.js";

export interface CreateWatcherOptions extends ChokidarOptions {
  /** @defaultValue `false` */
  quiet?: boolean;
  watchPath: string;
  onAddOrChange: (path: string, ready: boolean) => void;
  onRemove: (path: string) => void;
}

export function createWatcher({
  quiet,
  watchPath,
  onRemove,
  onAddOrChange,
  ...options
}: CreateWatcherOptions): FSWatcher {
  let ready = false;
  const watcher = chokidar.watch(watchPath, options);

  watcher.on("all", async (eventName, path) => {
    switch (eventName) {
      case "add":
      case "change":
        onAddOrChange(path, ready);
        break;
      case "unlink": {
        onRemove(path);
        break;
      }
    }
  });

  watcher.on("ready", () => {
    ready = true;
    enableLogger();
    log("Watching changes...");
    if (quiet) {
      disableLogger();
    }
  });

  return watcher;
}
