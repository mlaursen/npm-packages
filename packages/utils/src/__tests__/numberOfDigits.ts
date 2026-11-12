import { describe, expect, it } from "vitest";

import { numberOfDigits } from "../numberOfDigits.js";

describe("numberOfDigits", () => {
  it("should return the correct number of digits for integers", () => {
    expect(numberOfDigits(0)).toBe(1);
    expect(numberOfDigits(-0)).toBe(1);

    expect(numberOfDigits(1)).toBe(1);
    expect(numberOfDigits(-1)).toBe(1);

    expect(numberOfDigits(100)).toBe(3);
    expect(numberOfDigits(-100)).toBe(3);

    expect(numberOfDigits(99)).toBe(2);
    expect(numberOfDigits(-99)).toBe(2);
  });

  it("should return undefined if the value is undefined", () => {
    // oxlint-disable-next-line no-unassigned-vars
    let u: undefined;

    expect(numberOfDigits(u)).toBe(undefined);
  });
});
