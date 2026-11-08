import { describe, expect, it } from "vitest";

import { Duration, Easing } from "../../transition/constants.js";
import { slide } from "../slide.js";
import type { AnimateElementArgs } from "../types.js";

describe("slide", () => {
  it("should create a simple slide animation", () => {
    const animation = slide({
      from: "-100% -100%",
      to: "0 0",
    });

    expect(animation).toEqual([
      [{ translate: "-100% -100%" }, { translate: "0 0" }],
      { duration: Duration.Short3, easing: Easing.Emphasized },
    ] satisfies AnimateElementArgs);
  });

  it("should default to using custom properties for the from and to", () => {
    const animation = slide();

    expect(animation).toEqual([
      [
        { translate: "var(--slide-from-x, 0) var(--slide-from-y, -100%)" },
        { translate: "var(--slide-to-x, 0) var(--slide-to-y, 0)" },
      ],
      { duration: Duration.Short3, easing: Easing.Emphasized },
    ] satisfies AnimateElementArgs);
  });

  it("should allow for the content to also be revealed with defaults by setting reveal to true ", () => {
    const animation = slide({ reveal: true });
    expect(animation).toEqual([
      [
        {
          translate: "var(--slide-from-x, 0) var(--slide-from-y, -100%)",
          clipPath: "var(--reveal-from)",
        },
        {
          translate: "var(--slide-to-x, 0) var(--slide-to-y, 0)",
          clipPath: "var(--reveal-to)",
        },
      ],
      { duration: Duration.Short3, easing: Easing.Emphasized },
    ] satisfies AnimateElementArgs);
  });

  it("should support default slide downwards with an optional reveal", () => {
    const downwards = slide({ slideDirection: "downwards" });
    const downwardsReveal = slide({
      slideDirection: "downwards",
      reveal: true,
    });

    expect(downwards).toEqual([
      [
        { translate: "0 var(--slide-from-y, -100%)" },
        { translate: "0 var(--slide-to-y, 0)" },
      ],
      { duration: Duration.Medium2, easing: Easing.Emphasized },
    ] satisfies AnimateElementArgs);
    expect(downwardsReveal).toEqual([
      [
        {
          translate: "0 var(--slide-from-y, -100%)",
          clipPath: "inset(0 -100vmax 100% -100vmax)",
        },
        {
          translate: "0 var(--slide-to-y, 0)",
          clipPath: "inset(-100vmax)",
        },
      ],
      { duration: Duration.Medium2, easing: Easing.Emphasized },
    ] satisfies AnimateElementArgs);
  });

  it("should support default slide upwards with an optional reveal that changes the default timing and easing as well", () => {
    const upwards = slide({ slideDirection: "upwards" });
    const upwardsReveal = slide({ slideDirection: "upwards", reveal: true });

    expect(upwards).toEqual([
      [
        { translate: "0 var(--slide-from-y, 0)" },
        { translate: "0 var(--slide-to-y, -100%)" },
      ],
      { duration: Duration.Short3, easing: Easing.EmphasizedAccelerate },
    ] satisfies AnimateElementArgs);
    expect(upwardsReveal).toEqual([
      [
        {
          translate: "0 var(--slide-from-y, 0)",
          clipPath: "inset(0)",
        },
        {
          translate: "0 var(--slide-to-y, -100%)",
          // upwards only does 35% since it's normally an exit
          clipPath: "inset(0 -100vmax 35% -100vmax)",
        },
      ],
      { duration: Duration.Short3, easing: Easing.EmphasizedAccelerate },
    ] satisfies AnimateElementArgs);
  });

  it("should allow for custom values", () => {
    const custom = slide({
      from: "-3rem -3rem",
      to: "0 0",
      duration: 224,
      easing: "linear",
      reveal: {
        from: "circle(20%)",
        to: "xywh(0 5px 100% 75% round 15% 0)",
      },
    });

    expect(custom).toEqual([
      [
        {
          translate: "-3rem -3rem",
          clipPath: "circle(20%)",
        },
        {
          translate: "0 0",
          clipPath: "xywh(0 5px 100% 75% round 15% 0)",
        },
      ],
      { duration: 224, easing: "linear" },
    ] satisfies AnimateElementArgs);
  });
});
