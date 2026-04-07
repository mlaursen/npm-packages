import { describe, expect, it } from "vitest";

import { kebabCase } from "../kebabCase.js";

describe("kebabCase", () => {
  it("should convert a string to kebab-case", () => {
    expect(kebabCase("HelloWorld")).toBe("hello-world");
    expect(kebabCase("helloWorld")).toBe("hello-world");
  });
});
