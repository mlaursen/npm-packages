import { describe, expect, it } from "vitest";

import { upperFirst } from "../upperFirst.js";

describe("upperFirst", () => {
  it("should uppercase the first letter", () => {
    expect(upperFirst("hello world")).toBe("Hello world");
    expect(upperFirst("1hello world")).toBe("1hello world");
  });
});
