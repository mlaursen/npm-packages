import { Duration, Easing } from "../transition/constants.js";
import { getVar } from "../utils/tokens.js";
import { type AnimateDialogOptions } from "./types.js";

export const DEFAULT_DIALOG_OPEN_ANIMATION = {
  dialog: [
    [
      // slide down animation
      [
        {
          transform: `translateY(${getVar("dialog.transition.distance", "-1.875rem")})`,
          clipPath: "inset(0 0 100% 0)",
        },
        { transform: "translateY(0)", clipPath: "inset(0)" },
      ],
      {
        duration: Duration.Long2,
        easing: Easing.Emphasized,
      },
    ],

    // short opacity animation
    [
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: Duration.Short1,
        easing: Easing.Linear,
      },
    ],

    // scrim opacity animation
    [
      [{ opacity: 0 }, { opacity: getVar("dialog.scrim.opacity", 0.32) }],
      {
        duration: Duration.Long2,
        easing: Easing.Linear,
        pseudoElement: "::backdrop",
      },
    ],
  ],
  header: [
    [
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: Duration.Medium1, easing: Easing.Linear, fill: "forwards" },
    ],
  ],
  content: [
    [
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: Duration.Medium1, easing: Easing.Linear, fill: "forwards" },
    ],
  ],
  actions: [
    [
      [{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }],
      { duration: Duration.Medium1, easing: Easing.Linear, fill: "forwards" },
    ],
  ],
} as const satisfies AnimateDialogOptions;

export const DEFAULT_DIALOG_CLOSE_ANIMATION = {
  dialog: [
    [
      [
        {
          transform: "translateY(0)",
          clipPath: "inset(0)",
        },
        {
          transform: `translateY(${getVar("dialog.transition.distance", "-1.875rem")})`,
          clipPath: "inset(0 0 35% 0)",
        },
      ],
      { duration: Duration.Short3, easing: Easing.EmphasizedAccelerate },
    ],

    // main dialog opacity
    [
      [{ opacity: 1 }, { opacity: 0 }],
      {
        delay: Duration.Short2,
        duration: Duration.Short1,
        easing: Easing.Linear,
      },
    ],

    // scrim opacity animation
    [
      [{ opacity: getVar("dialog.scrim.opacity", 0.32) }, { opacity: 0 }],
      {
        duration: Duration.Short3,
        easing: Easing.Linear,
        pseudoElement: "::backdrop",
      },
    ],
  ],

  header: [
    [
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: Duration.Short2, easing: Easing.Linear, fill: "forwards" },
    ],
  ],
  content: [
    [
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: Duration.Short2, easing: Easing.Linear, fill: "forwards" },
    ],
  ],
  actions: [
    [
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: Duration.Short2, easing: Easing.Linear, fill: "forwards" },
    ],
  ],
} as const satisfies AnimateDialogOptions;
