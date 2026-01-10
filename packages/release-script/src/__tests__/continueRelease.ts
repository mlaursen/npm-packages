import confirm from "@inquirer/confirm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { continueRelease } from "../continueRelease.js";

vi.mock("@inquirer/confirm");

const confirmMock = vi.mocked(confirm);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("continueRelease", () => {
  it("should prompt the user to continue the release", async () => {
    confirmMock.mockResolvedValue(true);

    await expect(continueRelease()).resolves.toBeUndefined();
    expect(confirm).toHaveBeenCalledWith({ message: "Continue the release?" });
  });

  it("should throw an error if the user declines", async () => {
    confirmMock.mockResolvedValue(false);

    await expect(continueRelease()).rejects.toThrowError("Release cancelled");
  });
});
