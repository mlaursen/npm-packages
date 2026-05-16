import { constants, gzipSync } from "node:zlib";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { filesize } from "../filesize.js";

vi.mock("node:zlib", async (importActual) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importActual<typeof import("node:zlib")>();
  return { ...mod, gzipSync: vi.fn(() => ({ byteLength: 10 })) };
});

const gzipSyncMock = vi.mocked(gzipSync);
const byteLengthSpy = vi.spyOn(Buffer, "byteLength");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("filesize", () => {
  it("should just return the byteLength of the contents by default", () => {
    expect(filesize("hello, world!")).toBe(13);
    expect(gzipSyncMock).not.toHaveBeenCalled();
    expect(byteLengthSpy).toHaveBeenCalledExactlyOnceWith(
      "hello, world!",
      "utf8",
    );
  });

  it("should support gzip size", () => {
    expect(filesize("hello, world!", { gzip: true })).toBe(10);
    expect(byteLengthSpy).not.toHaveBeenCalled();
    expect(gzipSyncMock).toHaveBeenCalledExactlyOnceWith("hello, world!", {
      strategy: constants.Z_BEST_COMPRESSION,
    });
  });
});
