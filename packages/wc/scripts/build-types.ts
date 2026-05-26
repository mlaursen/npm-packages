/* eslint-disable unicorn/no-process-exit */
import {
  copyToDist,
  createWatcher,
  disableLogger,
  enableLogger,
  log,
  logFailure,
  logPending,
} from "@mlaursen/node-utils";
import { execSync, spawn } from "node:child_process";
import { rm } from "node:fs/promises";

const args = ["-p", "tsconfig.types.json"];
const watching = process.argv.includes("--watch");

if (watching) {
  args.push("--watch");
}

const command = `tsc ${args.join(" ")}`;
enableLogger();
if (watching) {
  logPending(command);
} else {
  log(command);
}
disableLogger();

const tsc = spawn("tsc", args, {
  stdio: "inherit",
});

tsc.on("error", (error) => {
  enableLogger();
  const message =
    error instanceof Error ? error.message : new Error(error).message;
  logFailure("[tsc] failed to start: " + message);
  process.exit(1);
});

const { promise, resolve, reject } = Promise.withResolvers();
tsc.on("close", (code) => {
  if (code !== null && code !== 0) {
    enableLogger();
    log(`[tsc] exited with code ${code}`);
    reject();
    process.exit(code);
  } else if (!watching) {
    resolve(void 0);
  }
});

let watcher: ReturnType<typeof createWatcher> | undefined;
if (watching) {
  watcher = createWatcher({
    quiet: true,
    watchPath: "./types",
    async onAddOrChange(path) {
      if (path.includes("types/index.d.ts")) {
        return;
      }

      const dist = path.replace("types/", "dist/");
      void copyToDist(path, dist);
    },
    onRemove(path) {
      rm(path);
    },
  });
} else {
  await promise;
  enableLogger();

  const command = `rsync -a --exclude="index.d.ts" --exclude="*.map" types/ dist/`;
  log(command);
  execSync(command, { stdio: "inherit" });
}

process.on("SIGINT", async () => {
  tsc.kill();
  await watcher?.close();
  process.exit();
});
