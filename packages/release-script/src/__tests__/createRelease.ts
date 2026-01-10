import confirm from "@inquirer/confirm";
import { Octokit } from "@octokit/core";
import dotenv from "dotenv";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRelease } from "../createRelease.js";

vi.mock("@octokit/core");
vi.mock("dotenv");
vi.mock("@inquirer/confirm");

const confirmMock = vi.mocked(confirm);
const OctokitMock = vi.mocked(Octokit);
const dotenvMock = vi.mocked(dotenv);

const octokitRequestMock = vi.fn();
const consoleLog = vi.spyOn(console, "log");
const consoleError = vi.spyOn(console, "error");

beforeEach(() => {
  vi.resetAllMocks();

  consoleLog.mockImplementation(() => {});
  consoleError.mockImplementation(() => {});
  octokitRequestMock.mockReturnValue({
    data: { html_url: "https://github.com/release-url" },
  });
  confirmMock.mockResolvedValue(true);
  OctokitMock.mockImplementation(function OctokitMocker() {
    return {
      request: octokitRequestMock,
    };
  });
});

describe("createRelease", () => {
  it("should create a release on github with the provided information", async () => {
    await expect(
      createRelease({
        body: "Example changelog",
        prerelease: false,
        repo: "example-repo",
        tagName: "example-repo@1.0.0",
      })
    ).resolves.toBeUndefined();

    expect(octokitRequestMock).toHaveBeenCalledExactlyOnceWith(
      "POST /repos/{owner}/{repo}/releases",
      {
        owner: "mlaursen",
        repo: "example-repo",
        tag_name: "example-repo@1.0.0",
        body: "Example changelog",
        prerelease: false,
      }
    );

    expect(consoleLog).toHaveBeenCalledWith(
      `Created release: https://github.com/release-url`
    );
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("should attempt to load the github auth token with dotenv", async () => {
    await createRelease({
      body: "Example changelog",
      prerelease: false,
      repo: "example-repo",
      tagName: "example-repo@1.0.0",
    });

    expect(dotenvMock.config).toHaveBeenCalledExactlyOnceWith({
      path: ".env.local",
      quiet: true,
      override: undefined,
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("should allow the owner to be configured", async () => {
    await createRelease({
      body: "Example changelog",
      prerelease: false,
      repo: "example-repo",
      tagName: "example-repo@1.0.0",
      owner: "someone-else",
    });

    expect(octokitRequestMock).toHaveBeenCalledExactlyOnceWith(
      "POST /repos/{owner}/{repo}/releases",
      {
        owner: "someone-else",
        repo: "example-repo",
        tag_name: "example-repo@1.0.0",
        body: "Example changelog",
        prerelease: false,
      }
    );
  });

  it("should attempt to re-create the release if the auth token expired", async () => {
    octokitRequestMock
      .mockRejectedValueOnce("Auth token expired")
      .mockResolvedValue({
        data: { html_url: "https://github.com/release-url" },
      });

    await createRelease({
      body: "Example changelog",
      prerelease: false,
      repo: "example-repo",
      tagName: "example-repo@1.0.0",
    });

    expect(dotenvMock.config).toHaveBeenCalledTimes(2);
    expect(dotenvMock.config.mock.calls[0]?.[0]).toEqual({
      path: ".env.local",
      quiet: true,
      override: undefined,
    });
    expect(dotenvMock.config.mock.calls[1]?.[0]).toEqual({
      path: ".env.local",
      quiet: true,
      override: true,
    });
    expect(OctokitMock).toHaveBeenCalledTimes(2);
    expect(octokitRequestMock).toHaveBeenCalledTimes(2);

    expect(consoleError).toHaveBeenCalledWith("Auth token expired");
    expect(consoleLog).toHaveBeenCalledWith(
      "The npm token is most likely expired or never created. Update the `.env.local` to include the latest GITHUB_TOKEN"
    );
    expect(consoleLog).toHaveBeenCalledWith(
      "Regenerate the token: https://github.com/settings/personal-access-tokens"
    );
    expect(confirmMock).toHaveBeenCalledExactlyOnceWith({
      message: "Try creating the Github release again?",
    });
  });

  it("should allow the release to be cancelled if the auth token expired", async () => {
    octokitRequestMock.mockRejectedValue("Auth token expired");
    confirmMock.mockResolvedValue(false);

    await expect(
      createRelease({
        body: "Example changelog",
        prerelease: false,
        repo: "example-repo",
        tagName: "example-repo@1.0.0",
      })
    ).rejects.toThrowError("Unable to create a Github release");
    expect(octokitRequestMock).toHaveBeenCalledTimes(1);
  });
});
