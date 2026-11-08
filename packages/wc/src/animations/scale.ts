import { Duration, Easing } from "../transition/constants.js";
import { createAnimation } from "./createAnimation.js";
import type {
  AnimateElementArgs,
  AnimateFromTo,
  BaseCreateAnimationOptions,
  CreateAnimationOptions,
} from "./types.js";

export interface ScaleAnimationOptions
  extends BaseCreateAnimationOptions, AnimateFromTo<string> {
  /**
   * @see AnimateFromTo.from
   * @defaultValue `"var(--scale-from-x, 0) var(--scale-from-y, 0)"`
   */
  from?: string;

  /**
   * @see AnimateFromTo.to
   * @defaultValue `"var(--scale-to-x, 1) var(--scale-to-y, 1)"`
   */
  to?: string;

  /**
   * @override
   * @defaultValue {@link Easing.Emphasized}
   */
  easing?: CreateAnimationOptions["easing"];

  /**
   * @override
   * @defaultValue {@link Duration.Short4}
   */
  duration?: CreateAnimationOptions["duration"];
}

/**
 * This is an animation helper to create scale animations. The default
 * implementation allows it to be configured by custom properties:
 *
 * @example Scale
```ts
import { scale, animate } from "@mlaursen/wc";

const animation = scale();
const element = document.querySelector("#some-element");

// these are the defaults and optional. this just shows what can be overridden
element.style.setPropertyValue("--scale-from-x", "0");
element.style.setPropertyValue("--scale-from-y", "0");
element.style.setPropertyValue("--scale-to-x", "1");
element.style.setPropertyValue("--scale-to-x", "1");

animate([[element, [animation]]]);
```
 */
export function scale(options: ScaleAnimationOptions = {}): AnimateElementArgs {
  const {
    from = "var(--scale-from-x, 0) var(--scale-from-y, 0)",
    to = "var(--scale-to-x, 1) var(--scale-to-y, 1)",
    easing = Easing.Emphasized,
    duration = Duration.Short4,
    ...timing
  } = options;

  return createAnimation({
    from: {
      scale: from,
    },
    to: {
      scale: to,
    },
    easing,
    duration,
    ...timing,
  });
}
