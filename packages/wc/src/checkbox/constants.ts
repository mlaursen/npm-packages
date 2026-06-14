import { Duration, Easing } from "../transition/constants.js";
import { type AnimateElementArgs } from "../transition/types.js";
import { getVar } from "../utils/tokens.js";
import { type AnimateCheckboxElementMap } from "./types.js";

const translate = `translate(${getVar("checkbox.mark.translate")})`;
const rotate = `rotate(${getVar("checkbox.mark.rotate")})`;
const baseTransform = `scaleY(-1) ${translate} ${rotate}`;

const SHORT_OPACITY_APPEAR = [
  [{ opacity: 0 }, { opacity: 1 }],
  {
    duration: Duration.Short1,
    easing: Easing.EmphasizedDecelerate,
  },
] as const satisfies AnimateElementArgs;

export const DEFAULT_CHECKBOX_CHECKED_ANIMATION = {
  shortMark: [
    SHORT_OPACITY_APPEAR,

    // draw the line upwards
    [
      [
        { transform: `${baseTransform} scaleY(0)` },
        { transform: baseTransform },
      ],
      {
        duration: Duration.Medium3,
        easing: Easing.EmphasizedDecelerate,
      },
    ],
  ],
  longMark: [
    SHORT_OPACITY_APPEAR,

    // draw the line upwards
    [
      [
        { transform: `${baseTransform} scaleX(0)` },
        { transform: `${baseTransform} scaleX(1)` },
      ],
      {
        duration: Duration.Medium3,
        easing: Easing.EmphasizedDecelerate,
      },
    ],
  ],
} as const satisfies AnimateCheckboxElementMap;

export const DEFAULT_CHECKBOX_UNCHECKED_ANIMATION = {
  background: [
    [
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: Duration.Short3, easing: Easing.EmphasizedAccelerate },
    ],
  ],
} as const satisfies AnimateCheckboxElementMap;

export const DEFAULT_CHECKBOX_INDETERMINATE_ANIMATION = {
  background: [SHORT_OPACITY_APPEAR],
  longMark: [
    // draw the line from left to right
    [
      [
        { transform: `${baseTransform} scaleX(0)` },
        { transform: baseTransform },
      ],
      { duration: Duration.Short3, easing: Easing.EmphasizedAccelerate },
    ],
  ],
} as const satisfies AnimateCheckboxElementMap;
