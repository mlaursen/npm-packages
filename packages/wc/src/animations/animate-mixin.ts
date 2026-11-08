import type { PropertyValues } from "lit";

import type { LitConstructor } from "../types.js";
import { animate } from "./animate.js";
import type {
  AnimationList,
  BaseAnimationOptions,
  AnimatedElementProperties,
} from "./types.js";

/**
 * The `AnimateMixin` should generally be used when the animation should be
 * triggered programmatically; otherwise the `OpenCloseAnimateMixin` is
 * recommended to toggle open/close states.
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
    #animationController: AbortController | null = null;

    protected override firstUpdated(changed: PropertyValues): void {
      super.firstUpdated(changed);

      this._initialized = true;
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.#animationController?.abort();
    }

    _getAnimations(_options: BaseAnimationOptions): AnimationList {
      return [];
    }

    async _animate(options: BaseAnimationOptions = {}): Promise<void> {
      this.#animationController?.abort();
      this.#animationController = null;

      const animations = this._getAnimations(options);
      if (animations.length === 0) {
        return;
      }

      this.#animationController = new AbortController();
      const signal = this.#animationController.signal;
      await animate(animations, { signal }).finished;
    }
  };
}
