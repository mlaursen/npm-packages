import { render } from "@react-md/core/test-utils";
import { describe, expect, it } from "vitest";

import { usePackageManager } from "../usePackageManager.js";

function Test() {
  usePackageManager();

  return null;
}

describe("usePackageManager", () => {
  it("should throw an error if no parent provider is provided", () => {
    expect(() => render(<Test />)).toThrowError(
      "PackageManagerProvider is not mounted"
    );
  });
});
