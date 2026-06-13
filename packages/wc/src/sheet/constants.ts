import { Duration, Easing } from "../transition/constants.js";
import type { AnimateSheetElementMap } from "./types.js";

export const DEFAULT_SHEET_OPEN_ANIMATION = {
  sheet: [
    [
      [
        {
          transform: "translateX(100%)",
        },
        {
          transform: "translateX(0)",
        },
      ],
      {
        duration: Duration.Long2,
        easing: Easing.Emphasized,
      },
    ],
  ],
} as const satisfies AnimateSheetElementMap;

export const DEFAULT_SHEET_CLOSE_ANIMATION = {
  sheet: [
    [
      [
        {
          transform: "translateX(0)",
        },
        {
          transform: "translateX(100%)",
        },
      ],
      {
        duration: Duration.Short3,
        easing: Easing.EmphasizedAccelerate,
      },
    ],
  ],
} as const satisfies AnimateSheetElementMap;
