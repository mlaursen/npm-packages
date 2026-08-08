import {
  DEFAULT_DIALOG_CLOSE_ANIMATION,
  DEFAULT_DIALOG_OPEN_ANIMATION,
} from "../dialog/constants.js";
import type { AnimateDialogElementMap } from "../dialog/types.js";
import { Duration, Easing } from "../transition/constants.js";
import { getVar } from "../utils/tokens.js";

const openFromX = getVar("sheet.open.from.x", 0);
const openFromY = getVar("sheet.open.from.y", 0);
const openToX = getVar("sheet.open.to.x", 0);
const openToY = getVar("sheet.open.to.y", 0);
const closeFromX = getVar("sheet.close.from.x", openToX);
const closeFromY = getVar("sheet.close.from.y", openToY);
const closeToX = getVar("sheet.close.to.x", openFromX);
const closeToY = getVar("sheet.close.to.y", openFromY);

export const DEFAULT_SHEET_OPEN_ANIMATION = {
  dialog: [
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

    ...DEFAULT_DIALOG_OPEN_ANIMATION.dialog.slice(2),
  ],
} as const satisfies AnimateDialogElementMap;

export const DEFAULT_SHEET_CLOSE_ANIMATION = {
  dialog: [
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

    ...DEFAULT_DIALOG_CLOSE_ANIMATION.dialog.slice(2),
  ],
} as const satisfies AnimateDialogElementMap;
