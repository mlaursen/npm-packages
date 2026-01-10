import confirm from "@inquirer/confirm";
import input from "@inquirer/input";
import { readFile } from "node:fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type PendingRelease,
  getPendingReleases,
} from "../getPendingReleases.js";
import { getUnpushedTags } from "../getUnpushedTags.js";

vi.mock("../getUnpushedTags");
vi.mock("@inquirer/confirm");
vi.mock("@inquirer/input");
vi.mock("node:fs/promises");

const getUnpushedTagsMock = vi.mocked(getUnpushedTags);
const confirmMock = vi.mocked(confirm);
const inputMock = vi.mocked(input);
const readFileMock = vi.mocked(readFile);

const FAKE_CHANGELOG = `# @mlaursen/eslint-config

## 5.1.1

### Patch Changes

- Fixed missing react and jsx-a11y plugins.

## 5.1.0

### Minor Changes

- Added support for the next eslint plugin and ignoring files with .gitignore

## 5.0.0

### Major Changes

- Update the eslint config to use eslint@9 or greater. Also includes a few other new eslint rules.`;

const DEFAULT_PENDING_RELEASES: PendingRelease[] = [
  {
    body: `## 5.1.1

### Patch Changes

- Fixed missing react and jsx-a11y plugins.
`,
    tagName: "@mlaursen/release-script@1.0.0",
  },
];

beforeEach(() => {
  vi.resetAllMocks();

  getUnpushedTagsMock.mockReturnValue(["@mlaursen/release-script@1.0.0"]);
  confirmMock.mockResolvedValue(true);
  inputMock.mockResolvedValue(".");
  readFileMock.mockResolvedValue(FAKE_CHANGELOG);
});

describe("getPendingReleases", () => {
  it("should throw an error if there are no unpushed tags", async () => {
    getUnpushedTagsMock.mockReturnValue([]);
    await expect(getPendingReleases({})).rejects.toThrowError(
      "Unable to find any pending releases"
    );

    expect(confirmMock).not.toHaveBeenCalled();
    expect(inputMock).not.toHaveBeenCalled();
    expect(readFileMock).not.toHaveBeenCalled();
  });

  it("should throw an error if all releases have been rejected", async () => {
    confirmMock.mockResolvedValue(false);

    await expect(getPendingReleases({})).rejects.toThrowError(
      "No pending releases were confirmed"
    );
    expect(inputMock).not.toHaveBeenCalled();
    expect(readFileMock).not.toHaveBeenCalled();
  });

  it("should confirm the release, prompt for a changelog location, find the next release log, and add to the list of available releases", async () => {
    await expect(getPendingReleases({})).resolves.toEqual(
      DEFAULT_PENDING_RELEASES
    );

    expect(confirmMock).toHaveBeenCalledExactlyOnceWith({
      message: "Include @mlaursen/release-script@1.0.0 in the release?",
    });
    expect(inputMock).toHaveBeenCalledExactlyOnceWith({
      message: "@mlaursen/release-script CHANGELOG exists at:",
      default: ".",
    });
  });

  it("should work for a changelog that has a single release", async () => {
    readFileMock.mockResolvedValue(`# @mlaursen/eslint-config

## 1.0.0

### Patch Changes

- Fixed missing react and jsx-a11y plugins.`);

    await expect(getPendingReleases({})).resolves.toEqual([
      {
        body: `## 1.0.0

### Patch Changes

- Fixed missing react and jsx-a11y plugins.`,
        tagName: "@mlaursen/release-script@1.0.0",
      },
    ] satisfies PendingRelease[]);
  });

  it("should allow for mapping each package to a changelog which will skip the CHANGELOG.md confirmation", async () => {
    await expect(
      getPendingReleases({
        packagePaths: {
          "@mlaursen/release-script": "./packages/release-script",
        },
      })
    ).resolves.toEqual(DEFAULT_PENDING_RELEASES);

    expect(confirmMock).toHaveBeenCalledWith({
      message: "Include @mlaursen/release-script@1.0.0 in the release?",
    });
    expect(inputMock).not.toHaveBeenCalled();
  });

  it("should support a monorepo with multiple packages", async () => {
    const eslintConfigChangelog = `## 1.0.0

### Major Changes

- initial release
`;
    const releaseScriptChangelog = `## 1.0.0

### Major Changes

- initial release for releases!

`;
    getUnpushedTagsMock.mockReturnValue([
      "@mlaursen/eslint-config@1.0.0",
      "@mlaursen/release-script@1.0.0",
    ]);
    readFileMock.mockResolvedValueOnce(`# @mlaursen/eslint-config

${eslintConfigChangelog}`).mockResolvedValueOnce(`# @mlaursen/release-script

${releaseScriptChangelog}`);

    await expect(getPendingReleases({})).resolves.toEqual([
      {
        body: eslintConfigChangelog,
        tagName: "@mlaursen/eslint-config@1.0.0",
      },
      {
        body: releaseScriptChangelog,
        tagName: "@mlaursen/release-script@1.0.0",
      },
    ] satisfies PendingRelease[]);
  });
});
