import { execSync } from "node:child_process";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { continueRelease } from "../continueRelease.js";
import { createRelease } from "../createRelease.js";
import { getPackageManager } from "../getPackageManager.js";
import {
  type PendingRelease,
  getPendingReleases,
} from "../getPendingReleases.js";
import { release } from "../release.js";

vi.mock("node:child_process");
vi.mock("../continueRelease");
vi.mock("../createRelease");
vi.mock("../getPackageManager");
vi.mock("../getPendingReleases");

const consoleLogSpy = vi.spyOn(console, "log");
const getPackageManagerMock = vi.mocked(getPackageManager);
const continueReleaseMock = vi.mocked(continueRelease);
const execSyncMock = vi.mocked(execSync);
const createReleaseMock = vi.mocked(createRelease);
const getPendingReleasesMock = vi.mocked(getPendingReleases);

const DEFAULT_RELEASES: PendingRelease[] = [
  {
    body: "",
    tagName: "@mlaursen/release-script@1.0.0",
  },
];

beforeEach(() => {
  vi.resetAllMocks();

  consoleLogSpy.mockImplementation(() => {});
  getPendingReleasesMock.mockResolvedValue(DEFAULT_RELEASES);
  getPackageManagerMock.mockResolvedValue("pnpm");
});

describe("release", () => {
  it("should go through all the steps for a release and passing the correct options to the other functions", async () => {
    await release({
      repo: "npm-packages",
    });

    expect(execSyncMock).toHaveBeenCalledTimes(7);
    expect(execSyncMock.mock.calls[0]?.[0]).toBe("pnpm clean");
    expect(execSyncMock.mock.calls[0]?.[1]).toBeUndefined();
    expect(execSyncMock.mock.calls[1]?.[0]).toBe("pnpm build");
    expect(execSyncMock.mock.calls[1]?.[1]).toBeUndefined();
    expect(execSyncMock.mock.calls[2]?.[0]).toBe("pnpm changeset version");
    expect(execSyncMock.mock.calls[2]?.[1]).toEqual({ stdio: "inherit" });
    expect(execSyncMock.mock.calls[3]?.[0]).toBe("git add -u");
    expect(execSyncMock.mock.calls[3]?.[1]).toBeUndefined();
    expect(execSyncMock.mock.calls[4]?.[0]).toBe(
      'git commit -m "build(version): version package"'
    );
    expect(execSyncMock.mock.calls[4]?.[1]).toBeUndefined();
    expect(execSyncMock.mock.calls[5]?.[0]).toBe("pnpm changeset publish");
    expect(execSyncMock.mock.calls[5]?.[1]).toEqual({ stdio: "inherit" });
    expect(execSyncMock.mock.calls[6]?.[0]).toBe("git push --follow-tags");
    expect(execSyncMock.mock.calls[6]?.[1]).toBeUndefined();

    expect(continueReleaseMock).toHaveBeenCalledTimes(2);

    expect(getPendingReleasesMock).toHaveBeenCalledWith({
      repo: "npm-packages",
    });

    expect(createReleaseMock).toHaveBeenCalledTimes(1);
    expect(createReleaseMock).toHaveBeenCalledExactlyOnceWith({
      repo: "npm-packages",
      ...DEFAULT_RELEASES[0],
      prerelease: false,
    });
  });

  it("should allow the build steps to be ignored", async () => {
    await release({ repo: "npm-packages", skipBuild: true });

    expect(execSyncMock).toHaveBeenCalledTimes(5);
    expect(execSyncMock).not.toHaveBeenCalledWith("pnpm clean", undefined);
    expect(execSyncMock).not.toHaveBeenCalledWith("pnpm build", undefined);
  });

  it("should allow the clean and build commands to be configured", async () => {
    await release({
      repo: "npm-packages",
      buildCommand: "build-dist",
      cleanCommand: "clean-dist",
    });

    expect(execSyncMock).toHaveBeenCalledWith("pnpm clean-dist", undefined);
    expect(execSyncMock).toHaveBeenCalledWith("pnpm build-dist", undefined);
  });

  it("should allow the version message to be changed", async () => {
    await release({
      repo: "npm-packages",
      versionMessage: "update version",
    });

    expect(execSyncMock).toHaveBeenCalledWith(
      'git commit -m "update version"',
      undefined
    );
  });
});
