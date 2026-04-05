import { describe, expect, it, vi } from "vitest";

import { log } from "../logger.js";

describe("logger", () => {
  it("should do nothing by default", () => {
    const consoleLog = vi.spyOn(console, "log");
    log("nothing");

    expect(consoleLog).not.toHaveBeenCalled();
  });
});
