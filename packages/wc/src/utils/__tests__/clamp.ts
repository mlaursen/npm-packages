import { describe, expect, it } from "vitest";

import { clamp } from "../clamp.js";

describe("clamp", () => {
  it("should return the value if the min or max values are undefined", () => {
    expect(clamp({ value: 100, min: undefined, max: undefined })).toBe(100);
    expect(clamp({ value: 0, min: undefined, max: undefined })).toBe(0);
    expect(clamp({ value: -100, min: undefined, max: undefined })).toBe(-100);
  });

  it("should return the correct value based on the min and max values", () => {
    expect(clamp({ value: 0, min: 0, max: 10 })).toBe(0);
    expect(clamp({ value: -1, min: 0, max: 10 })).toBe(0);
    expect(clamp({ value: -0.000_000_01, min: 0, max: 10 })).toBe(0);
    expect(clamp({ value: 20, min: 0, max: 20 })).toBe(20);
    expect(clamp({ value: 20, min: 0, max: 19 })).toBe(19);
    expect(clamp({ value: 10.5, min: 10, max: 11 })).toBe(10.5);
    expect(clamp({ value: 10.5, min: 9, max: 10 })).toBe(10);
  });
});
