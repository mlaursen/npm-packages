import type { AnimationList } from "./types.js";

export interface AnimateOptions {
  /**
   * An optional abort signal to cancel the animations.
   *
   * @example Cancel Animations
```ts
const controller = new AbortController();

animate([[element, animations]], { signal: controller.signal });
controller.abort()
```
   */
  signal?: AbortSignal;
}

export interface AnimateResult {
  /**
   * This list of created running animations which excludes elements that were
   * not found or empty animation arguments.
   */
  running: readonly Animation[];

  /**
   * This promise can be awaited to do something after the animations have
   * completed.
   *
   * @example
```ts
await animate([element, animations]).finished;
// console.log("animations complete!")
```
   */
  finished: Promise<Animation[]>;
}

/**
 * Animate elements when the `AnimateMixin`/`OpenCloseAnimateMixin` do not work
 * (like animating outside of `lit`).
 *
 * @example Animate Example
```ts
import type { AnimationList } from "@mlaursen/wc";
import { animate, createAnimation, fade, Duration, Easing } from "@mlaursen/wc";

const element = document.querySelector("#animation-target");
const animations = [
  [element, [
    fade(),
    createAnimation({
      from: { background: "red" },
      to: { background: "blue" },
      duration: Duration.Medium2,
      easing: Easing.Linear,
    }),
  ]],
] satisfies AnimationList;
```
 * @param animations the animations with elements to run. Nullish elements or
 * empty arg arrays will be ignored.
 * @param [options={}] the optional arguments. Only supports an abort signal at
 * this time to cancel running animations.
 */
export function animate(
  animations: AnimationList,
  options: AnimateOptions = {},
): AnimateResult {
  const { signal } = options;
  const running: Animation[] = [];
  const promises: Promise<Animation>[] = [];
  for (const [elementOrElements, animationArgs] of animations) {
    if (!animationArgs?.length || !elementOrElements) {
      continue;
    }

    const elements = Array.isArray(elementOrElements)
      ? elementOrElements
      : [elementOrElements];
    for (const element of elements) {
      if (!element) {
        continue;
      }

      for (const args of animationArgs) {
        const animation = element.animate(...args);
        running.push(animation);

        signal?.addEventListener("abort", () => {
          animation.cancel();
        });

        promises.push(animation.finished.catch(() => animation));
      }
    }
  }

  return {
    finished: Promise.all(promises),
    running,
  };
}
