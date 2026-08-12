import { copyFile } from "node:fs/promises";

import { describe, expect, it, vi } from "vitest";

import { copyToDist } from "../copyToDist.js";
import { ensureParentDir } from "../ensureParentDir.js";
import { log } from "../logger.js";

vi.mock("node:fs/promises");
vi.mock("../ensureParentDir.js");
vi.mock("../logger.js");

const copyFileMock = vi.mocked(copyFile);
const ensureParentDirMock = vi.mocked(ensureParentDir);
const logMock = vi.mocked(log);

describe("copyToDist", () => {
  it("should ensure the parent directory, copy the file, and log the result", async () => {
    await copyToDist("src/example.scss", "dist/example.scss");

    expect(ensureParentDirMock).toHaveBeenCalledWith("dist/example.scss");
    expect(copyFileMock).toHaveBeenCalledWith(
      "src/example.scss",
      "dist/example.scss",
    );
    expect(logMock).toHaveBeenCalledWith(
      "Copied src/example.scss -> dist/example.scss",
    );
  });
});
