import type { PropertyValues } from "lit";

import type { LitConstructor } from "../types.js";
import type {
  AnimationList,
  BaseAnimationOptions,
  AnimatedElementProperties,
} from "./types.js";

/**
 * The `AnimateMixin` should generally be used when the animation should be
 * triggered programmatically; otherwise the `AnimateMixin` is recommended to
 * toggle open/close states.
 *
 * The extending class should override the
 * {@link AnimatedElementProperties._getAnimations} function to define the
 * animations and call `this._animate()` to animate.
 */
export function AnimateMixin<T extends LitConstructor>(
  Base: T,
): T & LitConstructor<AnimatedElementProperties> {
  return class AnimatedElement
    extends Base
    implements AnimatedElementProperties
  {
    _initialized = false;
    #animationController?: AbortController;

    protected override firstUpdated(changed: PropertyValues): void {
      super.firstUpdated(changed);

      this._initialized = true;
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.#animationController?.abort();
    }

    /**
     * This is the current list of running animations.
     */
    #animations: Animation[] = [];

    _getAnimations(_options: BaseAnimationOptions): AnimationList {
      return [];
    }

    async _animate(options: BaseAnimationOptions = {}): Promise<void> {
      this.#animationController?.abort();
      this.#animationController = new AbortController();

      this.#animations = [];
      const animations = this._getAnimations(options);
      if (animations.length === 0) {
        return;
      }

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
            this.#animations.push(animation);
            this.#animationController.signal.addEventListener("abort", () => {
              animation.cancel();
            });

            promises.push(animation.finished.catch(() => animation));
          }
        }
      }

      await Promise.all(promises);
    }
  };
}
