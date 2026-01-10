import confirm from "@inquirer/confirm";
import rawlist from "@inquirer/rawlist";
import { execSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getCurrentChangeset } from "../getCurrentChangeset.js";

vi.mock("node:child_process");
vi.mock("node:fs/promises");
vi.mock("@inquirer/confirm");
vi.mock("@inquirer/rawlist");

const execSyncMock = vi.mocked(execSync);
const confirmMock = vi.mocked(confirm);
const rawlistMock = vi.mocked(rawlist);
const readFileMock = vi.mocked(readFile);
const readdirMock = vi.mocked(readdir);

const FAKE_CHANGELOG = `# @mlaursen/eslint-config

## 12.0.1

### Patch Changes

- ee3a1db: Reverted the tsconfigRootDir changes since it doesn't work how I expected.
`;

beforeEach(() => {
  vi.resetAllMocks();

  execSyncMock.mockReturnValue(".changeset/amazing-changeset-name.md");
  readFileMock.mockResolvedValue(FAKE_CHANGELOG);
  readdirMock.mockResolvedValue([]);
  confirmMock.mockResolvedValue(true);
  rawlistMock.mockResolvedValue("CHANGELOG.md");
});

describe("getCurrentChangeset", () => {
  it("should check for changesets in the .changeset directory and compare to the upstream", async () => {
    await expect(getCurrentChangeset()).resolves.toBe(FAKE_CHANGELOG);

    expect(execSyncMock).toHaveBeenCalledWith(
      "git diff --name-only @{upstream} .changeset/*.md"
    );
    expect(confirmMock).toHaveBeenCalledWith({
      message:
        'Is ".changeset/amazing-changeset-name.md" the correct changeset path?',
    });

    expect(readdirMock).not.toHaveBeenCalled();
    expect(rawlistMock).not.toHaveBeenCalled();
    expect(readFileMock).toHaveBeenCalledWith(
      ".changeset/amazing-changeset-name.md",
      "utf8"
    );
  });

  it("should attempt to find the changelogs in the changeset directory if there are no matches between differences with the remote branch", async () => {
    execSyncMock.mockReturnValue("");
    readdirMock.mockResolvedValue(
      // @ts-expect-error bad mocking
      ["changelog-1.md", "changelog-2.md", "this-should-be-ignored.txt"]
    );
    rawlistMock.mockResolvedValue("changelog-1.md");

    await expect(getCurrentChangeset()).resolves.toBe(FAKE_CHANGELOG);
    expect(readdirMock).toHaveBeenCalledExactlyOnceWith(".changeset");
    expect(rawlistMock).toHaveBeenCalledExactlyOnceWith({
      message: "Select the changeset path",
      choices: [{ value: "changelog-1.md" }, { value: "changelog-2.md" }],
    });
    expect(readFileMock).toHaveBeenCalledWith(
      ".changeset/changelog-1.md",
      "utf8"
    );
  });
});
