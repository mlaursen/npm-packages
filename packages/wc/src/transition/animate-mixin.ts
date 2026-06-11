import { type LitConstructor } from "../types.js";
import { BaseAnimateMixin } from "./base-animate-mixin.js";
import {
  type AnimateOptions,
  type AnimatedElementProperties,
  type AnimationList,
  type BaseAnimateOptions,
} from "./types.js";

export function AnimateMixin<T extends LitConstructor>(
  Base: T,
): T & LitConstructor<AnimatedElementProperties> {
  return class AnimatedLitElement
    extends BaseAnimateMixin(Base)
    implements AnimatedElementProperties
  {
    _opening = false;

    #connectedResolvers = Promise.withResolvers<undefined>();

    override connectedCallback(): void {
      super.connectedCallback();

      this.#connectedResolvers.resolve(void 0);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.#connectedResolvers = Promise.withResolvers();
    }

    _showElement(): void {}
    _closeElement(): void {}
    _isOpenable(): boolean {
      return true;
    }
    _isClosable(): boolean {
      return true;
    }

    _onBeforeOpen(): void {}
    _onOpenCanceled(): void {}
    _onBeforeClose(_options: BaseAnimateOptions): void {}
    _onCloseCanceled(): void {}
    _onNotConnectedClose(): void {}
    _onNotClosable(): void {}

    override _getAnimations(_options: AnimateOptions): AnimationList {
      return [];
    }

    override _animate(options: AnimateOptions): Promise<void> {
      return super._animate(options);
    }

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
  };
}
