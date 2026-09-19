import { describe, expect, it } from "vitest";

import { chunk } from "../chunk.js";

describe("chunk", () => {
  it("should return an empty list if provided an empty list", () => {
    expect(chunk([], 1)).toEqual([]);
    expect(chunk([], 5)).toEqual([]);
  });

  it("should throw a RangeError if the size is less than 1", () => {
    const error = new RangeError("size must be greater than 1");
    expect(() => chunk([], 0)).toThrow(error);
    expect(() => chunk([], -1)).toThrow(error);
  });

  it("should chunk an array based on the provided size", () => {
    const list = Array.from({ length: 1000 }, (_, i) => i);

    const chunked = chunk(list, 200);
    expect(chunked).toHaveLength(5);
    expect(chunked[0]).toEqual(Array.from({ length: 200 }, (_, i) => i));
    expect(chunked[1]).toEqual(Array.from({ length: 200 }, (_, i) => i + 200));
    expect(chunked[2]).toEqual(Array.from({ length: 200 }, (_, i) => i + 400));
    expect(chunked[3]).toEqual(Array.from({ length: 200 }, (_, i) => i + 600));
    expect(chunked[4]).toEqual(Array.from({ length: 200 }, (_, i) => i + 800));
  });

  it("should not require the size to be divisible by the length of the array", () => {
    const list = Array.from({ length: 33 }, (_, i) => i);

    expect(chunk(list, 5)).toHaveLength(7);
    expect(chunk(list, 30)).toHaveLength(2);
    expect(chunk(list, 100)).toHaveLength(1);
  });
});
