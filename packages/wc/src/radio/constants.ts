import { fade } from "../animations/fade.js";
import { scale } from "../animations/scale.js";
import { Duration, Easing } from "../transition/constants.js";
import type { AnimateRadioElementMap } from "./types.js";

export const DEFAULT_RADIO_CHECKED_ANIMATION = {
  mark: [
    fade({
      from: 0,
      to: 1,
      duration: Duration.Short1,
      easing: Easing.EmphasizedDecelerate,
    }),
    scale({
      from: "0",
      to: "1",
      duration: Duration.Medium2,
      easing: Easing.EmphasizedDecelerate,
    }),
  ],
} as const satisfies AnimateRadioElementMap;

export const DEFAULT_RADIO_UNCHECKED_ANIMATION =
  {} as const satisfies AnimateRadioElementMap;
