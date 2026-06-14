import { type PropertyValues } from "lit";

import { type LitConstructor } from "../types.js";
import {
  type AnimationList,
  type BaseAnimateOptions,
  type BaseAnimatedElementProperties,
} from "./types.js";

export function BaseAnimateMixin<T extends LitConstructor>(
  Base: T,
): T & LitConstructor<BaseAnimatedElementProperties> {
  return class BaseAnimatedElement
    extends Base
    implements BaseAnimatedElementProperties
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

    _animations: Animation[] = [];

    _getAnimations(_options: BaseAnimateOptions): AnimationList {
      return [];
    }

    async _animate(options: BaseAnimateOptions): Promise<void> {
      this.#animationController?.abort();
      this.#animationController = new AbortController();

      this._animations = [];
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
            this._animations.push(animation);
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
