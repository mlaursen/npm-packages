import { describe, expect, it } from "vitest";

import {
  createFakeCssModules,
  getFakeCssModuleClassName,
} from "../fake-css-modules.js";

describe("fake-css-modules", () => {
  describe("getFakeCssModuleClassName", () => {
    it("should just combine the fileName and the provided key to create a simple hash so it can be static", () => {
      expect(getFakeCssModuleClassName("CodeBlock", "container")).toBe(
        "CodeBlock_container__Q29kZ"
      );

      expect(
        getFakeCssModuleClassName("AnotherFileName", "andAnotherClass")
      ).toBe("AnotherFileName_andAnotherClass__QW5vd");
    });
  });

  describe("createFakeCssModules", () => {
    it("should just proxy any gets for a key with a fake css module name", () => {
      const styles1 = createFakeCssModules("CodeBlock");
      const styles2 = createFakeCssModules("AnotherFileName");

      expect(styles1["container"]).toBe("CodeBlock_container__Q29kZ");
      expect(styles1["container"]).toBe("CodeBlock_container__Q29kZ");
      expect(styles1["another"]).toBe("CodeBlock_another__Q29kZ");

      expect(styles2["andAnotherClass"]).toBe(
        "AnotherFileName_andAnotherClass__QW5vd"
      );
    });

    it("should ignore return false when the key is __esModule to support bundlers", () => {
      const styles = createFakeCssModules("SomeFileName");

      expect(styles["__esModule"]).toBe(false);
    });

    it("should return an empty string for non string-like keys", () => {
      const styles = createFakeCssModules("SomeFileName");

      // @ts-expect-error cannot use symbols for index types
      expect(styles[Symbol("example")]).toBe("");
    });
  });
});
