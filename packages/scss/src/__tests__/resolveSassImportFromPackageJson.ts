import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { resolveSassImportFromPackageJson } from "../resolveSassImportFromPackageJson.js";

const basePath = "/home/user-name/example-repo";

const createLoad = (jsonOrContents: string | object) => (path: string) => {
  if (path.endsWith("package.json")) {
    return typeof jsonOrContents === "string"
      ? jsonOrContents
      : JSON.stringify(jsonOrContents);
  }

  return "";
};

describe("resolveSassImportFromPackageJson", () => {
  describe("is only called from sass canonicalize", () => {
    it("should return null if the package.json cannot be resolved based on the derived path", () => {
      const load = vi.fn((path: string) => {
        if (path.endsWith("package.json")) {
          throw new Error("File does not exist");
        }

        return "";
      });

      expect(
        resolveSassImportFromPackageJson({
          url: "@mlaursen/wc",
          basePath,
          load,
        }),
      ).toBeNull();
      expect(load).toHaveBeenCalledExactlyOnceWith(
        join(basePath, "node_modules", "@mlaursen/wc", "package.json"),
      );
    });

    it("should return null if the package.json is not valid", () => {
      expect(
        resolveSassImportFromPackageJson({
          url: "@mlaursen/wc",
          basePath,
          load: createLoad("{ "),
        }),
      ).toBeNull();
    });

    it("should return null if there is no sass related fields", () => {
      expect(
        resolveSassImportFromPackageJson({
          url: "@mlaursen/wc",
          basePath,
          load: createLoad({
            name: "example-package",
            dependencies: {},
            devDependencies: { "@mlaursen/wc": "", sass: "" },
          }),
        }),
      ).toBeNull();
    });

    it("should be able to find a package and resolve the main field", () => {
      const load = vi.fn(
        createLoad({
          name: "example-package",
          sass: "./dist/_index.scss",
        }),
      );
      expect(
        resolveSassImportFromPackageJson({
          url: "example-package",
          basePath,
          load,
        }),
      ).toBe(`${basePath}/node_modules/example-package/dist/_index.scss`);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenLastCalledWith(
        `${basePath}/node_modules/example-package/dist/_index.scss`,
      );
    });

    it("should be able to find a scoped package and resolve the main field", () => {
      const load = vi.fn(
        createLoad({
          name: "@mlaursen/wc",
          sass: "./dist/_index.scss",
        }),
      );
      expect(
        resolveSassImportFromPackageJson({
          url: "@mlaursen/wc",
          basePath,
          load,
        }),
      ).toBe(`${basePath}/node_modules/@mlaursen/wc/dist/_index.scss`);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenLastCalledWith(
        `${basePath}/node_modules/@mlaursen/wc/dist/_index.scss`,
      );
    });
  });
});
