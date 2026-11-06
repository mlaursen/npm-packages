import { describe, expect, it } from "vitest";

import { getPossiblePaths } from "../getPossiblePaths.js";

describe("getPossiblePaths", () => {
  it("should return an empty list for undefined or an empty string", () => {
    expect(getPossiblePaths(undefined)).toEqual([]);
    expect(getPossiblePaths("")).toEqual([]);
  });

  it("should return the filename if it ends in .scss", () => {
    expect(getPossiblePaths("button.scss")).toEqual(["button.scss"]);
    expect(getPossiblePaths("src/button.scss")).toEqual(["src/button.scss"]);
    expect(getPossiblePaths("src/_button.scss")).toEqual(["src/_button.scss"]);
    expect(getPossiblePaths("/home/usr/project/src/button.scss")).toEqual([
      "/home/usr/project/src/button.scss",
    ]);
  });

  it("should be able to find files in the same folder by checking partials, unnamed files, and folder index files matching the name", () => {
    expect(getPossiblePaths("tokens")).toEqual([
      "_tokens.scss",
      "_tokens",
      "tokens.scss",
      "tokens",
      "tokens/_index.scss",
      "tokens/index.scss",
    ]);

    expect(getPossiblePaths("a/b/c/button")).toEqual([
      "a/b/c/_button.scss",
      "a/b/c/_button",
      "a/b/c/button.scss",
      "a/b/c/button",
      "a/b/c/button/_index.scss",
      "a/b/c/button/index.scss",
    ]);
  });

  it("should not add a second underscore when the last segment is already a partial", () => {
    expect(getPossiblePaths("src/_button")).toEqual([
      "src/_button.scss",
      "src/_button",
      "src/_button/_index.scss",
      "src/_button/index.scss",
    ]);
  });

  it("should only add the underscore to the last segment, not earlier ones", () => {
    expect(getPossiblePaths("_internal/button")[0]).toBe(
      "_internal/_button.scss",
    );
  });

  // Documents current behavior: with no slash, a name that already starts
  // with "_" gets a second underscore, unlike the slash case above.
  it("should double the underscore for a partial name without a slash", () => {
    expect(getPossiblePaths("_tokens")).toEqual([
      "_tokens.scss",
      "_tokens",
      "_tokens/_index.scss",
      "_tokens/index.scss",
    ]);
  });

  it("should try partials before the plain name, and files before folders", () => {
    const paths = getPossiblePaths("src/button");

    expect(paths.indexOf("src/_button.scss")).toBeLessThan(
      paths.indexOf("src/button.scss"),
    );
    expect(paths.indexOf("src/button.scss")).toBeLessThan(
      paths.indexOf("src/button/_index.scss"),
    );
    expect(paths.indexOf("src/button/_index.scss")).toBeLessThan(
      paths.indexOf("src/button/index.scss"),
    );
  });
});
