import type { AnimateElementArgs } from "../index.js";
import { Duration, Easing } from "../transition/constants.js";
import type { AnimateRadioElementMap } from "./types.js";

const SHORT_OPACITY_APPEAR = [
  [{ opacity: 0 }, { opacity: 1 }],
  {
    duration: Duration.Short1,
    easing: Easing.EmphasizedDecelerate,
  },
] as const satisfies AnimateElementArgs;

export const DEFAULT_RADIO_CHECKED_ANIMATION = {
  mark: [
    SHORT_OPACITY_APPEAR,
    [
      [{ transform: "scale(0)" }, { transform: "scale(1)" }],
      {
        duration: Duration.Medium2,
        easing: Easing.EmphasizedDecelerate,
      },
    ],
  ],
} as const satisfies AnimateRadioElementMap;

export const DEFAULT_RADIO_UNCHECKED_ANIMATION =
  {} as const satisfies AnimateRadioElementMap;
