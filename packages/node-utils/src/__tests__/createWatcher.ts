import chokidar, { type FSWatcher } from "chokidar";
import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createWatcher } from "../createWatcher.js";
import { enableLogger, log } from "../logger.js";

vi.mock("../logger.js");

const logMock = vi.mocked(log);
const enableLoggerMock = vi.mocked(enableLogger);
const chokidarWatchSpy = vi
  .spyOn(chokidar, "watch")
  // eslint-disable-next-line unicorn/prefer-event-target
  .mockImplementation(() => new EventEmitter() as FSWatcher);

const onRemove = vi.fn();
const onAddOrChange = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createWatcher", () => {
  it("should enable the logger once the watcher is ready", () => {
    const watcher = createWatcher({
      watchPath: "./example/path",
      onRemove,
      onAddOrChange,
    });

    expect(logMock).not.toHaveBeenCalled();
    expect(enableLoggerMock).not.toHaveBeenCalled();
    expect(chokidarWatchSpy).toHaveBeenCalledExactlyOnceWith(
      "./example/path",
      {},
    );
    expect(onRemove).not.toHaveBeenCalled();
    expect(onAddOrChange).not.toHaveBeenCalled();

    // simulate the real setup
    watcher.emit("all", "add", "./example/path/file1.ts");
    expect(logMock).not.toHaveBeenCalled();
    expect(enableLoggerMock).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
    expect(onAddOrChange).toHaveBeenCalledExactlyOnceWith(
      "./example/path/file1.ts",
      false,
    );

    watcher.emit("ready");
    expect(logMock).toHaveBeenCalledExactlyOnceWith("Watching changes...");
    expect(enableLoggerMock).toHaveBeenCalledTimes(1);
    expect(onRemove).not.toHaveBeenCalled();
    expect(onAddOrChange).toHaveBeenCalledExactlyOnceWith(
      "./example/path/file1.ts",
      false,
    );
  });

  it("should enable the ready flag for the onAddOrChange callback", async () => {
    const watcher = createWatcher({
      watchPath: "./example/path",
      onRemove,
      onAddOrChange,
    });

    expect(onAddOrChange).not.toHaveBeenCalled();

    // simulate the real setup
    watcher.emit("all", "add", "./example/path/file1.ts");
    expect(onAddOrChange).toHaveBeenCalledExactlyOnceWith(
      "./example/path/file1.ts",
      false,
    );

    watcher.emit("ready");
    watcher.emit("all", "change", "./example/path/file1.ts");
    expect(onAddOrChange).toHaveBeenLastCalledWith(
      "./example/path/file1.ts",
      true,
    );

    watcher.emit("all", "add", "./example/path/file2.ts");
    expect(onAddOrChange).toHaveBeenLastCalledWith(
      "./example/path/file2.ts",
      true,
    );
  });

  it("should support listening for removed files", () => {
    const watcher = createWatcher({
      watchPath: "./example/path",
      onRemove,
      onAddOrChange,
    });

    watcher.emit("all", "add", "./example/path/file1.ts");
    watcher.emit("ready");
    expect(onRemove).not.toHaveBeenCalled();
    expect(onAddOrChange).toHaveBeenCalledTimes(1);

    watcher.emit("all", "unlink", "./example/path/file1.ts");
    expect(onRemove).toHaveBeenCalledExactlyOnceWith("./example/path/file1.ts");
    expect(onAddOrChange).toHaveBeenCalledTimes(1);
  });
});
