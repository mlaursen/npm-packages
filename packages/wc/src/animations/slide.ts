import { Duration, Easing } from "../transition/constants.js";
import { createAnimation } from "./createAnimation.js";
import type {
  AnimateElementArgs,
  AnimateFromTo,
  BaseCreateAnimationOptions,
  CreateAnimationOptions,
} from "./types.js";

/** @internal */
interface SlidePresets {
  easing: string;
  duration: number;
  translate: Required<AnimateFromTo<string>>;
  reveal: Required<AnimateFromTo<string>>;
}

export const DEFAULT_SLIDE_ANIMATION = {
  easing: Easing.Emphasized,
  duration: Duration.Short3,
  translate: {
    from: "var(--slide-from-x, 0) var(--slide-from-y, -100%)",
    to: "var(--slide-to-x, 0) var(--slide-to-y, 0)",
  },
  reveal: {
    from: "var(--reveal-from)",
    to: "var(--reveal-to)",
  },
} as const satisfies SlidePresets;
export const DEFAULT_SLIDE_DIRECTIONS = {
  // the default clip path progressively reveals more content as the animation
  // progresses. the `-100vmax` is required so box-shadow still displays
  // correctly on the animating element if it is a dialog
  downwards: {
    easing: Easing.Emphasized,
    duration: Duration.Medium2,
    translate: {
      from: "0 var(--slide-from-y, -100%)",
      to: "0 var(--slide-to-y, 0)",
    },
    reveal: {
      from: "inset(0 -100vmax 100% -100vmax)",
      to: "inset(-100vmax)",
    },
  },
  upwards: {
    easing: Easing.EmphasizedAccelerate,
    duration: Duration.Short3,
    translate: {
      from: "0 var(--slide-from-y, 0)",
      to: "0 var(--slide-to-y, -100%)",
    },
    reveal: {
      from: "inset(0)",
      // upwards only does 35% since it's normally an exit
      to: "inset(0 -100vmax 35% -100vmax)",
    },
  },
} as const satisfies Record<string, SlidePresets>;
export type SlideDirection = keyof typeof DEFAULT_SLIDE_DIRECTIONS;

export interface SlideAnimationOptions
  extends BaseCreateAnimationOptions, AnimateFromTo<string> {
  /**
   * @see AnimateFromTo.from
   * @see DEFAULT_SLIDE_ANIMATION.translate.from
   * @defaultValue `DEFAULT_SLIDE_ANIMATION.translate.from`
   * @override
   */
  from?: string;

  /**
   * @see AnimateFromTo.to
   * @see DEFAULT_SLIDE_ANIMATION.translate.to
   * @defaultValue `DEFAULT_SLIDE_ANIMATION.translate.to`
   * @override
   */
  to?: string;

  /**
   * This can be used to also animate the `clip-path` of the element to
   * gradually reveal/hide the content as it is animating.
   *
   * - `true` - {@link DEFAULT_SLIDE_ANIMATION.reveal}
   * - `"upwards"` - {@link DEFAULT_SLIDE_DIRECTIONS.upwards.reveal}
   * - `"downwards"` - {@link DEFAULT_SLIDE_DIRECTIONS.downwards.reveal}
   * - `false` - undefined
   * - or whatever {@link AnimateFromTo} you define
   */
  reveal?: AnimateFromTo<string> | SlideDirection | boolean;

  /**
   * This is only used for generating a default.
   *
   * @see DEFAULT_SLIDE_DIRECTIONS.upwards
   * @see DEFAULT_SLIDE_DIRECTIONS.downwards
   * @see reveal
   * @see easing
   * @see duration
   */
  slideDirection?: SlideDirection | null;

  /**
   * @see DEFAULT_SLIDE_ANIMATION.easing
   * @see DEFAULT_SLIDE_DIRECTIONS.upwards.easing
   * @see DEFAULT_SLIDE_DIRECTIONS.downwards.easing
   * @override
   */
  easing?: CreateAnimationOptions["easing"];

  /**
   * @see DEFAULT_SLIDE_ANIMATION.duration
   * @see DEFAULT_SLIDE_DIRECTIONS.upwards.duration
   * @see DEFAULT_SLIDE_DIRECTIONS.downwards.duration
   * @override
   */
  duration?: CreateAnimationOptions["duration"];
}

function isSlideDirection(value: unknown): value is SlideDirection {
  return typeof value === "string" && value in DEFAULT_SLIDE_DIRECTIONS;
}

function getPresets(direction?: unknown): SlidePresets {
  return isSlideDirection(direction)
    ? DEFAULT_SLIDE_DIRECTIONS[direction]
    : DEFAULT_SLIDE_ANIMATION;
}

function getRevealConfig(
  reveal: SlideAnimationOptions["reveal"],
  slideDirection: SlideDirection | null | undefined,
): AnimateFromTo<string> {
  if (reveal === true) {
    return getPresets(slideDirection).reveal;
  }

  if (isSlideDirection(reveal)) {
    return getPresets(reveal).reveal;
  }

  return reveal || {};
}

/**
 * This is an animation helper to create fade animations. The default
 * implementation allows it to be configured by custom properties:
 *
 * @example Default Slide
```ts
import { slide, animate } from "@mlaursen/wc";

const animation = slide();
const element = document.querySelector("#some-element");

// these are the defaults and optional. this just shows what can be overridden
element.style.setPropertyValue("--slide-from-x", "0");
element.style.setPropertyValue("--slide-from-y", "-100%");
element.style.setPropertyValue("--slide-to-x", "0");
element.style.setPropertyValue("--slide-to-x", "0");

animate([[element, [animation]]]);
```
 *
 * There is also support to slide with a reveal:
 *
 * @example Default Reveal Slide
```ts
import { slide, animate } from "@mlaursen/wc";

const animation = slide({ reveal: true });
const element = document.querySelector("#some-element");

// the same slide properties from before, but now requiring clip path values
element.style.setPropertyValue("--reveal-from", "circle(100%)");
element.style.setPropertyValue("--reveal-to", "circle(40%)");

animate([[element, [animation]]]);
```
 */
export function slide(options: SlideAnimationOptions = {}): AnimateElementArgs {
  const { slideDirection, reveal, from, to, easing, duration, ...timing } =
    options;

  const presets = getPresets(slideDirection);
  const revealConfig = getRevealConfig(reveal, slideDirection);

  return createAnimation({
    from: {
      translate: from ?? presets.translate.from,
      clipPath: revealConfig.from,
    },
    to: {
      translate: to ?? presets.translate.to,
      clipPath: revealConfig.to,
    },
    easing: easing ?? presets.easing,
    duration: duration ?? presets.duration,
    ...timing,
  });
}
