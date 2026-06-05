import { type LitConstructor } from "../types.js";
import {
  type AnimateOptions,
  type AnimatedElementProperties,
  type AnimationList,
  type BaseAnimateOptions,
} from "./types.js";

export const AnimateMixin = <T extends LitConstructor>(
  Base: T,
): T & LitConstructor<AnimatedElementProperties> =>
  class AnimatedLitElement extends Base implements AnimatedElementProperties {
    _opening = false;

    #connectedResolvers = Promise.withResolvers<undefined>();
    #animationController?: AbortController;

    override connectedCallback(): void {
      super.connectedCallback();

      this.#connectedResolvers.resolve(void 0);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.#connectedResolvers = Promise.withResolvers();
      this.#animationController?.abort();
    }

    _showElement(): void {}
    _closeElement(): void {}
    _isOpenable(): boolean {
      return true;
    }
    _isClosable(): boolean {
      return true;
    }
    _getAnimations(_options: AnimateOptions): AnimationList {
      return [];
    }

    _onBeforeOpen(): void {}
    _onOpenCanceled(): void {}
    _onBeforeClose(_options: BaseAnimateOptions): void {}
    _onCloseCanceled(): void {}
    _onNotConnectedClose(): void {}
    _onNotClosable(): void {}

    async show(options: BaseAnimateOptions = {}): Promise<void> {
      const { animate } = options;
      this._opening = true;

      await this.#connectedResolvers.promise;
      await this.updateComplete;
      if (!this._opening || !this._isOpenable()) {
        this._opening = false;
        return;
      }

      this._onBeforeOpen();
      const canceled = !this.dispatchEvent(
        new Event("open", { cancelable: true }),
      );
      if (canceled) {
        this._onOpenCanceled();
        this._opening = false;
        return;
      }

      this._showElement();
      await this._animate({ animate, opening: true });
      this.dispatchEvent(new Event("opened"));
      this._opening = false;
    }

    async close(options: BaseAnimateOptions = {}): Promise<void> {
      const { animate } = options;

      this._opening = false;
      if (!this.isConnected) {
        this._onNotConnectedClose();
        return;
      }

      await this.updateComplete;
      if (this._opening || !this._isClosable()) {
        this._onNotClosable();
        return;
      }

      this._onBeforeClose(options);
      const canceled = !this.dispatchEvent(
        new Event("close", { cancelable: true }),
      );
      if (canceled) {
        this._onCloseCanceled();
        return;
      }

      await this._animate({ animate, opening: false });
      this._closeElement();
      this.dispatchEvent(new Event("closed"));
    }

    async _animate(options: AnimateOptions): Promise<void> {
      this.#animationController?.abort();
      this.#animationController = new AbortController();

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
