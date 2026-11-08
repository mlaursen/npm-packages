import { describe, expect, it } from "vitest";

import { Duration, Easing } from "../../transition/constants.js";
import { scale } from "../scale.js";
import type { AnimateElementArgs } from "../types.js";

describe("scale", () => {
  it("should create a simple scale animation", () => {
    const animation = scale({
      from: "-100% -100%",
      to: "0 0",
    });

    expect(animation).toEqual([
      [{ scale: "-100% -100%" }, { scale: "0 0" }],
      { duration: Duration.Short4, easing: Easing.Emphasized },
    ] satisfies AnimateElementArgs);
  });

  it("should default to using custom properties for the from and to", () => {
    const animation = scale();

    expect(animation).toEqual([
      [
        { scale: "var(--scale-from-x, 0) var(--scale-from-y, 0)" },
        { scale: "var(--scale-to-x, 1) var(--scale-to-y, 1)" },
      ],
      { duration: Duration.Short4, easing: Easing.Emphasized },
    ] satisfies AnimateElementArgs);
  });
});
