import { fade } from "../animations/fade.js";
import { scale } from "../animations/scale.js";
import { Duration, Easing } from "../transition/constants.js";
import { getVar } from "../utils/tokens.js";
import type { AnimatePopoverElementMap } from "./types.js";

const closedOpacity = getVar("popover.closed.opacity", 0);
const openOpacity = getVar("popover.open.opacity", 1);
const closedScale = getVar("popover.closed.transform", "scale(1)");
const openScale = getVar("popover.open.transform", "scale(1)");

export const DEFAULT_SHOW_POPOVER_ANIMATION = {
  popover: [
    fade({
      from: closedOpacity,
      to: openOpacity,
      duration: Duration.Short4,
      easing: Easing.Linear,
    }),
    scale({
      from: closedScale,
      to: openScale,
      duration: Duration.Short4,
      easing: Easing.Linear,
    }),
  ],
} as const satisfies Partial<AnimatePopoverElementMap>;

export const DEFAULT_HIDE_POPOVER_ANIMATION = {
  popover: [
    [
      [
        {
          opacity: openOpacity,
          transform: openScale,
        },
        {
          opacity: closedOpacity,
          transform: closedScale,
        },
      ],
      {
        duration: Duration.Short4,
        easing: Easing.Linear,
      },
    ],
  ],
} as const satisfies Partial<AnimatePopoverElementMap>;
