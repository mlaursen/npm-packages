import { describe, expect, it } from "vitest";

import { camelCase } from "../camelCase.js";

describe("camelCase", () => {
  it("should convert a string to camelCase", () => {
    expect(camelCase("hello world")).toBe("helloWorld");
  });

  it("should allow an optional separator", () => {
    expect(camelCase("hello world", " ")).toBe("hello World");
  });
});
