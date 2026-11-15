import { fade } from "../animations/fade.js";
import type { AnimatePopoverElementMap } from "./types.js";

export const DEFAULT_SHOW_POPOVER_ANIMATION = {
  popover: [fade({ from: 0, to: 1 })],
} as const satisfies Partial<AnimatePopoverElementMap>;

export const DEFAULT_HIDE_POPOVER_ANIMATION = {
  popover: [fade({ from: 1, to: 0 })],
} as const satisfies Partial<AnimatePopoverElementMap>;
