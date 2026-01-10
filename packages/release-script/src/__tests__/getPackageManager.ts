import { readFile } from "node:fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPackageManager } from "../getPackageManager.js";

vi.mock("node:fs/promises");

const readFileMock = vi.mocked(readFile);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getPackageManager", () => {
  it("should throw an error if there is no root package.json", async () => {
    readFileMock.mockRejectedValue(new Error("File not found"));

    await expect(getPackageManager()).rejects.toThrowError("File not found");
  });

  it("should attempt to read the volta property if it exists", async () => {
    readFileMock.mockResolvedValue(
      JSON.stringify({ volta: { node: "24.0.0", pnpm: "10.0.0" } })
    );

    await expect(getPackageManager()).resolves.toBe("pnpm");

    readFileMock.mockResolvedValue(
      JSON.stringify({ volta: { node: "24.0.0", yarn: "4.0.0" } })
    );
    await expect(getPackageManager()).resolves.toBe("yarn");

    readFileMock.mockResolvedValue(
      JSON.stringify({ volta: { node: "24.0.0", npm: "19.0.0" } })
    );
    await expect(getPackageManager()).resolves.toBe("npm");
  });

  it("should fallback to reading the packageManager field", async () => {
    readFileMock.mockResolvedValue(
      JSON.stringify({
        packageManager: "pnpm@10.24.0",
      })
    );

    await expect(getPackageManager()).resolves.toBe("pnpm");
  });

  it("should throw an error if the packageManager field does not resolve to a known manager", async () => {
    readFileMock.mockResolvedValue(
      JSON.stringify({
        packageManager: "something@4.3.3",
      })
    );

    await expect(getPackageManager()).rejects.toThrowError(
      'Unsupported package manager "something" in package.json'
    );
  });

  it("should throw an error if volta and packageManager do not exist", async () => {
    readFileMock.mockResolvedValue(JSON.stringify({}));

    await expect(getPackageManager()).rejects.toThrowError(
      "Unable to find a package manager"
    );
  });
});
