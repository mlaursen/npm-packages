import { scale } from "../animations/scale.js";
import type { AnimateToastElementMap } from "./types.js";

export const DEFAULT_TOAST_OPEN_ANIMATION = {
  toast: [
    scale({
      from: "0 0",
      to: "1 1",
    }),
  ],
} as const satisfies AnimateToastElementMap;

export const DEFAULT_TOAST_CLOSE_ANIMATION = {
  toast: [
    scale({
      from: "1 1",
      to: "0 0",
    }),
  ],
} as const satisfies AnimateToastElementMap;

/** 5s */
export const DEFAULT_TOAST_TIMEOUT = 5000;
