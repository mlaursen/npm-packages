import { describe, expect, it } from "vitest";

import { Duration, Easing } from "../../transition/constants.js";
import { createAnimation } from "../createAnimation.js";
import type { AnimateElementArgs } from "../types.js";

describe("createAnimation", () => {
  it("should be able to create a simple animation", () => {
    const animation = createAnimation({
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: Duration.Short3,
      easing: Easing.Linear,
    });
    expect(animation).toEqual([
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: Duration.Short3, easing: Easing.Linear },
    ] satisfies AnimateElementArgs);
  });

  it("should remap the pseudoElement to pseudo so you can get some autocomplete behavior", () => {
    const animation = createAnimation({
      from: { opacity: 0 },
      to: { opacity: 0.32 },
      pseudoElement: "::backdrop",

      duration: Duration.Short3,
      easing: Easing.Linear,
    });
    expect(animation).toEqual([
      [{ opacity: 0 }, { opacity: 0.32 }],
      {
        duration: Duration.Short3,
        easing: Easing.Linear,
        pseudoElement: "::backdrop",
      },
    ] satisfies AnimateElementArgs);
  });

  it("should support an array for the from attribute to create animations with more than 2 steps", () => {
    const animation = createAnimation({
      from: [{ opacity: 0 }, { opacity: 0, offset: 0.2 }],
      to: { opacity: 1 },
      duration: Duration.Medium1,
      easing: Easing.Linear,
      fill: "forwards",
    });

    expect(animation).toEqual([
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: Duration.Medium1, easing: Easing.Linear, fill: "forwards" },
    ] satisfies AnimateElementArgs);
  });
});
