import { createAnimation } from "../animations/createAnimation.js";
import { fade } from "../animations/fade.js";
import { Duration, Easing } from "../transition/constants.js";
import { getVar } from "../utils/tokens.js";
import type { AnimateCheckboxElementMap } from "./types.js";

const translate = `translate(${getVar("checkbox.mark.translate")})`;
const rotate = `rotate(${getVar("checkbox.mark.rotate")})`;
const baseTransform = `scaleY(-1) ${translate} ${rotate}`;

const shortFade = fade({
  from: 0,
  to: 1,
  duration: Duration.Short1,
  easing: Easing.EmphasizedDecelerate,
});

export const DEFAULT_CHECKBOX_CHECKED_ANIMATION = {
  shortMark: [
    shortFade,

    // draw the line upwards
    createAnimation({
      from: {
        transform: `${baseTransform} scaleY(0)`,
      },
      to: {
        transform: baseTransform,
      },
      easing: Easing.EmphasizedDecelerate,
      duration: Duration.Medium3,
    }),
  ],
  longMark: [
    shortFade,

    // draw the line upwards
    createAnimation({
      from: {
        transform: `${baseTransform} scaleX(0)`,
      },
      to: {
        transform: `${baseTransform} scaleX(1)`,
      },
      duration: Duration.Medium3,
      easing: Easing.EmphasizedDecelerate,
    }),
  ],
} as const satisfies AnimateCheckboxElementMap;

export const DEFAULT_CHECKBOX_UNCHECKED_ANIMATION = {
  background: [
    fade({
      from: 1,
      to: 0,
      easing: Easing.EmphasizedAccelerate,
    }),
  ],
} as const satisfies AnimateCheckboxElementMap;

export const DEFAULT_CHECKBOX_INDETERMINATE_ANIMATION = {
  background: [shortFade],
  longMark: [
    // draw the line from left to right
    createAnimation({
      from: {
        transform: `${baseTransform} scaleX(0)`,
      },
      to: {
        transform: baseTransform,
      },
      duration: Duration.Short3,
      easing: Easing.EmphasizedAccelerate,
    }),
  ],
} as const satisfies AnimateCheckboxElementMap;
