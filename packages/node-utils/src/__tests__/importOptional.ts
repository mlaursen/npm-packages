// oxlint-disable typescript/consistent-type-imports
import { describe, expect, it } from "vitest";

import {
  importOptional,
  isModuleNotFound,
  isProbablyErrnoException,
} from "../importOptional.js";

const getFixture = (name: string): string =>
  new URL(`../__testsfixtures__/${name}`, import.meta.url).href;

describe("importOptional", () => {
  it("should return the module when it resolves", async () => {
    const path = await importOptional<typeof import("node:path")>(
      "node:path",
      "example feature",
    );

    expect(path.join).toBeInstanceOf(Function);
  });

  it("should log a hint error message when the module does not exist", async () => {
    const name = "this-package-name-does-not-exist";
    const feature = "example feature";

    await expect(importOptional(name, feature)).rejects.toThrow(
      new Error(
        `${feature} requires "${name}". Install it with: npm i -D ${name}`,
      ),
    );
  });

  it("should include the cause when the module doesn't exist", async () => {
    const name = "this-package-name-does-not-exist";
    const feature = "example feature";

    const error = await importOptional(name, feature).catch((error) => error);
    if (!(error instanceof Error)) {
      throw new TypeError("Invalid error");
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("Install it with");
    expect(error.cause).toBeInstanceOf(Error);
  });

  it("should rethrow other errors", async () => {
    await expect(
      importOptional(getFixture("throws.mjs"), "Feature"),
    ).rejects.toThrow("boom");
  });

  it("should unwrap CJS modules that export a function", async () => {
    const fn = await importOptional<() => string>(
      getFixture("cjs-function.cjs"),
      "Feature",
    );

    expect(fn()).toBe("hi");
  });

  it("should keep the namespace when there are named exports", async () => {
    const mod = await importOptional<{ foo: number; bar: number }>(
      getFixture("cjs-named.cjs"),
      "Feature",
    );

    expect(mod.foo).toBe(1);
    expect(mod.bar).toBe(2);
  });

  describe("error checking", () => {
    function errno(message: string, code?: string): NodeJS.ErrnoException {
      const error: NodeJS.ErrnoException = new Error(message);
      if (code) {
        error.code = code;
      }
      return error;
    }

    describe("isProbablyErrnoException", () => {
      it("accepts an Error that has a code", () => {
        expect(isProbablyErrnoException(errno("x", "ENOENT"))).toBe(true);
      });

      it("rejects an Error without a code", () => {
        expect(isProbablyErrnoException(new Error("x"))).toBe(false);
      });

      it.each([
        ["a string", "MODULE_NOT_FOUND"],
        ["a plain object", { code: "MODULE_NOT_FOUND" }],
        ["null", null],
        ["undefined", undefined],
      ])("rejects %s", (_label, value) => {
        expect(isProbablyErrnoException(value)).toBe(false);
      });
    });

    describe("isModuleNotFound", () => {
      it.each(["ERR_MODULE_NOT_FOUND", "MODULE_NOT_FOUND"])(
        "matches code %s",
        (code) => {
          expect(isModuleNotFound(errno("anything", code), "sass")).toBe(true);
        },
      );

      it("matches when the message quotes the module name", () => {
        expect(
          isModuleNotFound(errno("Cannot find 'sass'", "OTHER"), "sass"),
        ).toBe(true);
      });

      it("does not match an unrelated code and message", () => {
        expect(isModuleNotFound(errno("nope", "EACCES"), "sass")).toBe(false);
      });

      it("requires the name to be single-quoted in the message", () => {
        expect(
          isModuleNotFound(errno("Cannot find sass", "OTHER"), "sass"),
        ).toBe(false);
      });
    });
  });
});
