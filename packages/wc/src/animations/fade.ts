import { Duration, Easing } from "../transition/constants.js";
import { createAnimation } from "./createAnimation.js";
import type {
  AnimateElementArgs,
  AnimateFromTo,
  BaseCreateAnimationOptions,
  CreateAnimationOptions,
  KeyframeDescriptor,
  KeyframeDescriptors,
  OneOrManyKeyframeDescriptors,
} from "./types.js";

export type FadeFromThenOthers = readonly [
  from: number | string,
  ...offsets: KeyframeDescriptors,
];
export type FadeFromDescriptors =
  | number
  | string
  | FadeFromThenOthers
  | OneOrManyKeyframeDescriptors;
export type FadeToDescriptors = number | string | KeyframeDescriptor;

const isDescriptor = (value: unknown): value is KeyframeDescriptor =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStringOrNumber = (value: unknown): value is string | number =>
  typeof value === "string" || typeof value === "number";

const isFadeFromList = (
  value: readonly unknown[],
): value is FadeFromThenOthers => isStringOrNumber(value[0]);

export interface FadeAnimationOptions
  extends
    BaseCreateAnimationOptions,
    AnimateFromTo<FadeFromDescriptors, FadeToDescriptors> {
  /**
   * @see CreateAnimationOptions.from
   * @defaultValue `"var(--fade-from)"`
   */
  from?: FadeFromDescriptors;

  /**
   * @see CreateAnimationOptions.to
   * @defaultValue `"var(--fade-to)"`
   */
  to?: FadeToDescriptors;

  /**
   * @override
   * @defaultValue {@link Easing.Linear}
   */
  easing?: CreateAnimationOptions["easing"];

  /**
   * @override
   * @defaultValue {@link Duration.Short3}
   */
  duration?: CreateAnimationOptions["duration"];
}

/**
 * This is an animation helper to create fade animations. The default
 * implementation allows it to be configured by custom properties:
 *
 * @example Fade
```ts
import { fade, animate } from "@mlaursen/wc";

const animation = fade();
const element = document.querySelector("#some-element");

// these are the defaults and optional. this just shows what can be overridden
element.style.setPropertyValue("--fade-from", "0");
element.style.setPropertyValue("--fade-to", "1");
animate([[element, [animation]]]);
```
 */
export function fade(options: FadeAnimationOptions = {}): AnimateElementArgs {
  const {
    from = "var(--fade-from, 0)",
    to = "var(--fade-to, 1)",
    duration = Duration.Short3,
    easing = Easing.Linear,
    ...timing
  } = options;

  const animateFrom: KeyframeDescriptor[] = [];
  if (isStringOrNumber(from)) {
    animateFrom.push({ opacity: from });
  } else if (isDescriptor(from)) {
    animateFrom.push(from);
  } else if (isFadeFromList(from)) {
    const [first, ...remaining] = from;
    animateFrom.push({ opacity: first }, ...remaining);
  } else {
    animateFrom.push(...from);
  }

  return createAnimation({
    from: animateFrom,
    to: isStringOrNumber(to) ? { opacity: to } : to,
    duration,
    easing,
    ...timing,
  });
}
