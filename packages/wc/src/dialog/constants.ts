import { fade } from "../animations/fade.js";
import { slide } from "../animations/slide.js";
import { Duration, Easing } from "../transition/constants.js";
import { getVar } from "../utils/tokens.js";
import type { AnimateDialogElementMap } from "./types.js";

const backdropOpacity = getVar("dialog.scrim.opacity", 0.32);
const offsetFade = fade({
  from: [0, { opacity: 0, offset: 0.2 }],
  to: 1,
  fill: "forwards",
  duration: Duration.Medium1,
});

export const DEFAULT_DIALOG_BACKDROP_OPEN_ANIMATION = fade({
  pseudoElement: "::backdrop",
  from: 0,
  to: backdropOpacity,
  easing: Easing.Linear,
  duration: Duration.Long2,
});

export const DEFAULT_DIALOG_OPEN_ANIMATION = {
  dialog: [
    // slide down with fade
    slide({
      slideDirection: "downwards",
      from: `0 ${getVar("dialog.slide.distance", "-1.875rem")}`,
      to: "0 0",
      reveal: true,
      duration: Duration.Long2,
      easing: Easing.Emphasized,
    }),
    fade({
      from: 0,
      to: 1,
      duration: Duration.Short1,
    }),

    DEFAULT_DIALOG_BACKDROP_OPEN_ANIMATION,
  ],
  header: [offsetFade],
  content: [offsetFade],
  actions: [
    fade({
      from: [0, { opacity: 0, offset: 0.5 }],
      to: 1,
      fill: "forwards",
      duration: Duration.Medium1,
    }),
  ],
} as const satisfies AnimateDialogElementMap;

const shortFade = fade({
  from: 1,
  to: 0,
  duration: Duration.Short2,
  fill: "forwards",
});

export const DEFAULT_DIALOG_BACKDROP_CLOSE_ANIMATION = fade({
  pseudoElement: "::backdrop",
  from: backdropOpacity,
  to: 0,
});
export const DEFAULT_DIALOG_CLOSE_ANIMATION = {
  dialog: [
    // slide up with delayed fade
    slide({
      slideDirection: "upwards",
      from: "0 0",
      to: `0 ${getVar("dialog.slide.distance", "-1.875rem")}`,
      reveal: true,
    }),
    fade({
      from: 1,
      to: 0,
      delay: Duration.Short2,
      duration: Duration.Short1,
    }),

    // backdrop fade
    DEFAULT_DIALOG_BACKDROP_CLOSE_ANIMATION,
  ],

  header: [shortFade],
  content: [shortFade],
  actions: [shortFade],
} as const satisfies AnimateDialogElementMap;
