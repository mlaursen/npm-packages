import { slide } from "../animations/slide.js";
import {
  DEFAULT_DIALOG_BACKDROP_CLOSE_ANIMATION,
  DEFAULT_DIALOG_BACKDROP_OPEN_ANIMATION,
} from "../dialog/constants.js";
import type { AnimateDialogElementMap } from "../dialog/types.js";
import { Duration, Easing } from "../transition/constants.js";
import { calcRtlTranslate } from "../utils/rtl.js";
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
    slide({
      from: `${calcRtlTranslate(openFromX)} ${openFromY}`,
      to: `${calcRtlTranslate(openToX)} ${openToY}`,
      duration: Duration.Long2,
    }),

    DEFAULT_DIALOG_BACKDROP_OPEN_ANIMATION,
  ],
} as const satisfies AnimateDialogElementMap;

export const DEFAULT_SHEET_CLOSE_ANIMATION = {
  dialog: [
    slide({
      from: `${calcRtlTranslate(closeFromX)} ${closeFromY}`,
      to: `${calcRtlTranslate(closeToX)} ${closeToY}`,
      easing: Easing.EmphasizedAccelerate,
    }),

    DEFAULT_DIALOG_BACKDROP_CLOSE_ANIMATION,
  ],
} as const satisfies AnimateDialogElementMap;
