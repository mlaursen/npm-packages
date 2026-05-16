import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ensureParentDir } from "../ensureParentDir.js";

vi.mock("node:fs");
vi.mock("node:fs/promises");

const mkdirMock = vi.mocked(mkdir);
const existsSyncMock = vi.mocked(existsSync);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("ensureParentDir", () => {
  it("should create the parent directories for a filePath if they do not exist", async () => {
    existsSyncMock.mockReturnValue(false);

    await ensureParentDir("src/example.ts");
    expect(mkdirMock).toHaveBeenCalledWith("src", { recursive: true });
  });

  it("should do nothing if the directory exists", async () => {
    existsSyncMock.mockReturnValue(true);

    await ensureParentDir("src/example.ts");
    expect(mkdirMock).not.toHaveBeenCalled();
  });
});
