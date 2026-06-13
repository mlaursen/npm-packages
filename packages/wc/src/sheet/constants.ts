import { Duration, Easing } from "../transition/constants.js";
import { getVar } from "../utils/tokens.js";
import { type AnimateSheetElementMap } from "./types.js";

const openFromX = getVar("sheet.open.from.x", 0);
const openFromY = getVar("sheet.open.from.y", 0);
const openToX = getVar("sheet.open.to.x", 0);
const openToY = getVar("sheet.open.to.y", 0);
const closeFromX = getVar("sheet.close.from.x", openToX);
const closeFromY = getVar("sheet.close.from.y", openToY);
const closeToX = getVar("sheet.close.to.x", openFromX);
const closeToY = getVar("sheet.close.to.y", openFromY);

export const DEFAULT_SHEET_OPEN_ANIMATION = {
  sheet: [
    [
      [
        {
          transform: `translate(${openFromX}, ${openFromY})`,
        },
        {
          transform: `translate(${openToX}, ${openToY})`,
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
          transform: `translate(${closeFromX}, ${closeFromY})`,
        },
        {
          transform: `translate(${closeToX}, ${closeToY})`,
        },
      ],
      {
        duration: Duration.Short3,
        easing: Easing.EmphasizedAccelerate,
      },
    ],
  ],
} as const satisfies AnimateSheetElementMap;
