import { describe, it, expect } from "vitest";

import { Duration, Easing } from "../../transition/constants.js";
import { fade } from "../fade.js";
import type { AnimateElementArgs } from "../types.js";

describe("fade", () => {
  it("should create a simple opacity animation", () => {
    const animation = fade({
      from: 0,
      to: 1,
    });

    expect(animation).toEqual([
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: Duration.Short3, easing: Easing.Linear },
    ] satisfies AnimateElementArgs);
  });

  it("should support numbers or strings so custom properties can be used", () => {
    const animation = fade({
      from: "var(--fade-from)",
      to: "var(--fade-to)",
    });
    expect(animation).toEqual([
      [{ opacity: "var(--fade-from)" }, { opacity: "var(--fade-to)" }],
      { duration: Duration.Short3, easing: Easing.Linear },
    ] satisfies AnimateElementArgs);
  });

  it("should default to using custom properties for the from and to", () => {
    const animation = fade();
    expect(animation).toEqual([
      [{ opacity: "var(--fade-from, 0)" }, { opacity: "var(--fade-to, 1)" }],
      { duration: Duration.Short3, easing: Easing.Linear },
    ] satisfies AnimateElementArgs);
  });

  it("should support a from descriptor list to support staggered animations", () => {
    const animation = fade({
      from: [0, { opacity: 0, offset: 0.2 }],
      to: 1,
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
