import { describe, expect, it } from "vitest";

import { createMediaQuery } from "../utils.js";

describe("createMediaQuery", () => {
  it("should return null in node environments", () => {
    expect(globalThis.matchMedia).toBe(undefined);

    expect(createMediaQuery("phone")).toBe(null);
    expect(createMediaQuery("")).toBe(null);
    // @ts-expect-error invalid type
    expect(createMediaQuery("fake", { fake: "whatever" })).toBe(null);
  });
});
