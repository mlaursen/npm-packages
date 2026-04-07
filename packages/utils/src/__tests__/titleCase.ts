import { describe, expect, it } from "vitest";

import { titleCase } from "../titleCase.js";

describe("titleCase", () => {
  it("should convert a string to TitleCase", () => {
    expect(titleCase("helloWorld")).toBe("Hello World");
    expect(titleCase("hello world")).toBe("Hello world");
  });

  it("should allow an optional splitter", () => {
    expect(titleCase("hello world", " ")).toBe("Hello World");
  });
});
