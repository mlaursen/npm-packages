import { writeFile } from "node:fs/promises";

import { format as oxfmt } from "oxfmt";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FilesizeOptions } from "../filesize.js";
import { GENERATED_FILE_BANNER, generateFile } from "../generateFile.js";
import { logComplete } from "../logger.js";
import { prettyFilesize } from "../prettyFilesize.js";

vi.mock("node:fs/promises");
vi.mock("oxfmt", () => ({
  format: vi.fn((_filePath: string, code: string) =>
    Promise.resolve({ code: code + ";" }),
  ),
}));
vi.mock("../logger.js");
vi.mock("../prettyFilesize.js");

const writeFileMock = vi.mocked(writeFile);
const oxfmtMock = vi.mocked(oxfmt);
const logCompleteMock = vi.mocked(logComplete);
const prettyFilesizeMock = vi.mocked(prettyFilesize).mockReturnValue("3B");

const filePath = "./src/example.ts";
const cwdFilePath = `${process.cwd()}/src/example.ts`;
const contents = "export const x = 3";
const formatted = `${contents};`;
const contentsWithBanner = `${GENERATED_FILE_BANNER}${contents}`;
const formattedWithBanner = `${contentsWithBanner};`;
const logMessage = `Wrote "${filePath}"`;
const logMessageWithFileSize = `${logMessage} (3B)`;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("generateFile", () => {
  it("should default to adding a banner, formatting the file, and logging the result with a pretty filesize", async () => {
    await generateFile({ contents, filePath });

    expect(oxfmtMock).toHaveBeenCalledExactlyOnceWith(
      filePath,
      contentsWithBanner,
    );
    expect(writeFileMock).toHaveBeenCalledExactlyOnceWith(
      filePath,
      formattedWithBanner,
      "utf8",
    );
    expect(logCompleteMock).toHaveBeenCalledExactlyOnceWith(logMessage);
    expect(prettyFilesizeMock).not.toHaveBeenCalled();
  });

  it("should support removing the file banner", async () => {
    await generateFile({ contents, filePath, banner: false });

    expect(oxfmtMock).toHaveBeenCalledExactlyOnceWith(filePath, contents);
    expect(writeFileMock).toHaveBeenCalledExactlyOnceWith(
      filePath,
      formatted,
      "utf8",
    );
    expect(logCompleteMock).toHaveBeenCalledExactlyOnceWith(logMessage);
    expect(prettyFilesizeMock).not.toHaveBeenCalled();
  });

  it("should support a custom banner", async () => {
    const banner = "// this is a custom banner!\n";
    const contentsWithBanner = `${banner}${contents}`;
    const formattedWithBanner = `${contentsWithBanner};`;
    await generateFile({ contents, filePath, banner });

    expect(oxfmtMock).toHaveBeenCalledExactlyOnceWith(
      filePath,
      contentsWithBanner,
    );
    expect(writeFileMock).toHaveBeenCalledExactlyOnceWith(
      filePath,
      formattedWithBanner,
      "utf8",
    );
    expect(logCompleteMock).toHaveBeenCalledExactlyOnceWith(logMessage);
    expect(prettyFilesizeMock).not.toHaveBeenCalled();
  });

  it("should support printing the filesize", async () => {
    const options = undefined;
    await generateFile({ contents, filePath, fileSize: true });
    expect(prettyFilesizeMock).toHaveBeenCalledExactlyOnceWith(
      formattedWithBanner,
      options,
    );
    expect(logCompleteMock).toHaveBeenCalledExactlyOnceWith(
      logMessageWithFileSize,
    );
  });

  it("should support printing the filesize with custom options", async () => {
    const options: FilesizeOptions = { gzip: true };
    await generateFile({ contents, filePath, fileSize: options });
    expect(prettyFilesizeMock).toHaveBeenCalledExactlyOnceWith(
      formattedWithBanner,
      options,
    );
    expect(logCompleteMock).toHaveBeenCalledExactlyOnceWith(
      logMessageWithFileSize,
    );
  });

  it("should allow default to removing the process.cwd() prefix", async () => {
    await generateFile({ contents, filePath: cwdFilePath });

    expect(logCompleteMock).toHaveBeenCalledExactlyOnceWith(
      'Wrote "src/example.ts"',
    );
  });

  it("should allow for a custom log fileName", async () => {
    const getLoggedFileName = vi.fn(
      (filePath: string): string => `a new file! ${filePath}`,
    );
    await generateFile({ contents, filePath, getLoggedFileName });
    expect(logCompleteMock).toHaveBeenCalledExactlyOnceWith(
      'Wrote "a new file! ./src/example.ts"',
    );
  });
});
