import { describe, expect, it } from "vitest";

import { pascalCase } from "../pascalCase.js";

describe("pascalCase", () => {
  it("should convert a string to PascalCase", () => {
    expect(pascalCase("hello world")).toBe("HelloWorld");
  });

  it("should allow an optional separator", () => {
    expect(pascalCase("hello world", " ")).toBe("Hello World");
  });
});
