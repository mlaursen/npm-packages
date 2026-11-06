import { describe, expect, it } from "vitest";

import { assertSassResolvePackageJson } from "../assertSassResolvePackageJson.js";

describe("assertSassResolvePackageJson", () => {
  describe("valid package.json", () => {
    it.each([
      ["a sass string", { sass: "./index.scss" }],
      ["a main string", { main: "./index.js" }],
      ["an exports object", { exports: { ".": "./index.js" } }],
      [
        "an exports object with sass conditions",
        { exports: { ".": { sass: "./index.scss" } } },
      ],
      ["an empty exports object", { exports: {} }],
      [
        "all of sass, main, and exports",
        {
          sass: "./index.scss",
          main: "./index.js",
          exports: { ".": "./index.js" },
        },
      ],
    ])("should not throw for %s", (_label, value) => {
      expect(() => assertSassResolvePackageJson(value)).not.toThrow();
    });

    it("should pass when only one valid field exists next to invalid ones", () => {
      expect(() =>
        assertSassResolvePackageJson({ sass: 1, main: "./index.js" }),
      ).not.toThrow();
      expect(() =>
        assertSassResolvePackageJson({
          main: null,
          exports: { ".": "./a.js" },
        }),
      ).not.toThrow();
    });

    it("should ignore unrelated fields", () => {
      expect(() =>
        assertSassResolvePackageJson({ name: "pkg", main: "./index.js" }),
      ).not.toThrow();
    });
  });

  describe("invalid package.json", () => {
    it.each([
      ["null", null],
      ["undefined", undefined],
      ["a string", "package.json"],
      ["a number", 1],
      ["a boolean", true],
      ["a function", () => {}],
    ])("should throw for %s", (_label, value) => {
      expect(() => assertSassResolvePackageJson(value)).toThrow(
        "Invalid package.json",
      );
    });

    it("should throw for an empty object", () => {
      expect(() => assertSassResolvePackageJson({})).toThrow(
        "Invalid package.json",
      );
    });

    it("should throw for an array", () => {
      expect(() => assertSassResolvePackageJson([])).toThrow(
        "Invalid package.json",
      );
    });

    it("should throw when none of the fields are usable", () => {
      expect(() => assertSassResolvePackageJson({ name: "pkg" })).toThrow(
        "Invalid package.json",
      );
    });

    it.each([
      ["sass is not a string", { sass: 1 }],
      ["main is not a string", { main: ["./index.js"] }],
      ["exports is null", { exports: null }],
      ["exports is a string", { exports: "./index.js" }],
      ["exports is a number", { exports: 1 }],
      ["all fields have the wrong type", { sass: 1, main: 2, exports: null }],
    ])("should throw when %s", (_label, value) => {
      expect(() => assertSassResolvePackageJson(value)).toThrow(
        "Invalid package.json",
      );
    });
  });

  describe("type narrowing", () => {
    it("should narrow the value after the assertion", () => {
      const value: unknown = { sass: "./index.scss" };
      assertSassResolvePackageJson(value);

      // compile-time check: `sass` is accessible without a cast
      expect(value.sass).toBe("./index.scss");
    });
  });
});
