import { execSync } from "node:child_process";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  LOCAL_TAGS_COMMAND,
  REMOTE_TAGS_COMMAND,
  getUnpushedTags,
} from "../getUnpushedTags.js";

vi.mock("node:child_process");

const execSyncMock = vi.mocked(execSync);

const fakeCommitSha = (): string =>
  Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getUnpushedTags", () => {
  it("should return an empty list if there are no tags", () => {
    execSyncMock.mockReturnValue("");

    expect(getUnpushedTags()).toEqual([]);
  });

  it("should return an empty list if all the tags have already been pushed", () => {
    execSyncMock.mockReturnValueOnce("@react-md/core@7.0.0")
      .mockReturnValueOnce(`${fakeCommitSha}	refs/tags/@react-md/core@7.0.0
${fakeCommitSha}	refs/tags/@react-md/core@7.0.0^{}`);

    expect(getUnpushedTags()).toEqual([]);
  });

  it("should compare the local tags with the remote tags and return the difference", () => {
    execSyncMock.mockImplementation((command: unknown): string => {
      if (command === LOCAL_TAGS_COMMAND) {
        return `@react-md/core@7.0.0
@react-md/material-icons@7.0.0
@react-md/material-icons@6.2.10
@react-md/core@6.5.2
@react-md/core@6.5.1
@react-md/material-icons@6.2.9`;
      }

      if (command === REMOTE_TAGS_COMMAND) {
        return `${fakeCommitSha}	refs/tags/@react-md/core@6.5.1
${fakeCommitSha}	refs/tags/@react-md/core@6.5.1^{}
${fakeCommitSha}	refs/tags/@react-md/core@6.5.2
${fakeCommitSha}	refs/tags/@react-md/core@6.5.2^{}
${fakeCommitSha}	refs/tags/@react-md/material-icons@6.2.10
${fakeCommitSha}	refs/tags/@react-md/material-icons@6.2.10^{}
${fakeCommitSha}	refs/tags/@react-md/material-icons@6.2.9
${fakeCommitSha}	refs/tags/@react-md/material-icons@6.2.9^{}`;
      }

      throw new Error("Invalid command");
    });

    expect(getUnpushedTags()).toEqual([
      "@react-md/core@7.0.0",
      "@react-md/material-icons@7.0.0",
    ]);
  });
});
