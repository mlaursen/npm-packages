import { spawnSync } from "node:child_process";
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
const spawnSyncMock = vi.mocked(spawnSync);
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
  spawnSyncMock.mockReturnValue({
    status: 0,
    signal: null,
    pid: 1,
    output: [],
    stdout: "",
    stderr: "",
  });
  getPendingReleasesMock.mockResolvedValue(DEFAULT_RELEASES);
  getPackageManagerMock.mockResolvedValue("pnpm");
});

describe("release", () => {
  it("should go through all the steps for a release and passing the correct options to the other functions", async () => {
    await release({
      repo: "npm-packages",
    });

    expect(spawnSyncMock).toHaveBeenCalledTimes(7);
    expect(spawnSyncMock).toHaveBeenCalledWith("pnpm", ["clean"], undefined);
    expect(spawnSyncMock).toHaveBeenCalledWith("pnpm", ["build"], undefined);
    expect(spawnSyncMock).toHaveBeenCalledWith(
      "pnpm",
      ["changeset", "version"],
      { stdio: "inherit" }
    );
    expect(spawnSyncMock).toHaveBeenCalledWith("git", ["add", "-u"], undefined);
    expect(spawnSyncMock).toHaveBeenCalledWith(
      "git",
      ["commit", "-m", "build(version): version package"],
      undefined
    );
    expect(spawnSyncMock).toHaveBeenCalledWith(
      "pnpm",
      ["changeset", "publish"],
      { stdio: "inherit" }
    );
    expect(spawnSyncMock).toHaveBeenCalledWith(
      "git",
      ["push", "--follow-tags"],
      undefined
    );

    expect(continueReleaseMock).toHaveBeenCalledTimes(2);

    expect(getPendingReleasesMock).toHaveBeenCalledWith({
      repo: "npm-packages",
    });

    expect(createReleaseMock).toHaveBeenCalledTimes(1);
    expect(createReleaseMock).toHaveBeenCalledExactlyOnceWith({
      repo: "npm-packages",
      owner: "mlaursen",
      envPath: ".env.local",
      ...DEFAULT_RELEASES[0],
      prerelease: false,
    });
  });

  it("should allow the build steps to be ignored", async () => {
    await release({ repo: "npm-packages", skipBuild: true });

    expect(spawnSyncMock).toHaveBeenCalledTimes(5);
    expect(spawnSyncMock).not.toHaveBeenCalledWith(
      "pnpm",
      ["clean"],
      undefined
    );
    expect(spawnSyncMock).not.toHaveBeenCalledWith(
      "pnpm",
      ["build"],
      undefined
    );
  });

  it("should allow the clean and build commands to be configured", async () => {
    await release({
      repo: "npm-packages",
      buildCommand: "build-dist",
      cleanCommand: "clean-dist",
    });

    expect(spawnSyncMock).toHaveBeenCalledWith(
      "pnpm",
      ["clean-dist"],
      undefined
    );
    expect(spawnSyncMock).toHaveBeenCalledWith(
      "pnpm",
      ["build-dist"],
      undefined
    );
  });

  it("should allow the version message to be changed", async () => {
    await release({
      repo: "npm-packages",
      versionMessage: "update version",
    });

    expect(spawnSyncMock).toHaveBeenCalledWith(
      "git",
      ["commit", "-m", "update version"],
      undefined
    );
  });

  it("should allow only doing the github release steps to handle weird failures", async () => {
    await release({
      repo: "npm-packages",
      publishTags: ["@mlaursen/release-script@1.1.1"],
    });

    expect(spawnSyncMock).toHaveBeenCalledTimes(1);
    expect(spawnSyncMock).toHaveBeenCalledWith(
      "git",
      ["push", "--follow-tags"],
      undefined
    );
    expect(getPendingReleasesMock).toHaveBeenCalledWith({
      repo: "npm-packages",
      publishTags: ["@mlaursen/release-script@1.1.1"],
    });
    expect(createReleaseMock).toHaveBeenCalledTimes(1);
    expect(createReleaseMock).toHaveBeenCalledExactlyOnceWith({
      repo: "npm-packages",
      owner: "mlaursen",
      envPath: ".env.local",
      ...DEFAULT_RELEASES[0],
      prerelease: false,
    });
  });
});
