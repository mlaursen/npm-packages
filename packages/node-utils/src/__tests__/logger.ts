import { beforeEach, describe, expect, it, vi } from "vitest";

import { disableLogger, enableLogger, log } from "../logger.js";

const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

beforeEach(() => {
  disableLogger();

  vi.clearAllMocks();
});

describe("logger", () => {
  it("should do nothing by default", () => {
    log("nothing");

    expect(consoleLog).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("should default to console.log after the logger has been enabled", () => {
    enableLogger();

    log("Hello, world!");
    expect(consoleLog).toHaveBeenCalledExactlyOnceWith("Hello, world!");
  });

  it("should support the console.error", () => {
    enableLogger();

    log("bad", "error");
    expect(consoleLog).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledExactlyOnceWith("bad");
  });

  it("should support the console.warn", () => {
    enableLogger();

    log("warning!", "warn");
    expect(consoleLog).not.toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalledExactlyOnceWith("warning!");
    expect(consoleError).not.toHaveBeenCalled();
  });
});
