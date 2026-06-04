import { Duration, Easing } from "../transition/constants.js";
import { getVar } from "../utils/tokens.js";
import { type AnimatePopoverElementMap } from "./types.js";

export const DEFAULT_SHOW_POPOVER_ANIMATION = {
  popover: [
    [
      [
        {
          opacity: getVar("popover.closed.opacity", 0),
          transform: getVar("popover.closed.transform", "scale(1)"),
        },
        {
          opacity: getVar("popover.open.opacity", 1),
          transform: getVar("popover.open.transform", "scale(1)"),
        },
      ],
      {
        duration: Duration.Short4,
        easing: Easing.Linear,
      },
    ],
  ],
} as const satisfies Partial<AnimatePopoverElementMap>;

export const DEFAULT_HIDE_POPOVER_ANIMATION = {
  popover: [
    [
      [
        {
          opacity: getVar("popover.open.opacity", 1),
          transform: getVar("popover.open.transform", "scale(1)"),
        },
        {
          opacity: getVar("popover.closed.opacity", 0),
          transform: getVar("popover.closed.transform", "scale(1)"),
        },
      ],
      {
        duration: Duration.Short4,
        easing: Easing.Linear,
      },
    ],
  ],
} as const satisfies Partial<AnimatePopoverElementMap>;
