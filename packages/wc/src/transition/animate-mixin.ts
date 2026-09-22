import { property } from "lit/decorators.js";

import type { LitConstructor } from "../types.js";
import { BaseAnimateMixin } from "./base-animate-mixin.js";
import type {
  AnimateOptions,
  AnimatedElementProperties,
  AnimationList,
  BaseAnimateOptions,
} from "./types.js";

export function AnimateMixin<T extends LitConstructor>(
  Base: T,
): T & LitConstructor<AnimatedElementProperties> {
  class AnimatedLitElement
    extends BaseAnimateMixin(Base)
    implements AnimatedElementProperties
  {
    @property({ type: Boolean, reflect: true })
    opening = false;

    @property({ type: Boolean, reflect: true })
    closing = false;
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
      // do not animate if not yet initialized by default
      const { animate = this._initialized } = options;
      this.closing = false;
      this.opening = true;

      await this.#connectedResolvers.promise;
      await this.updateComplete;
      if (!this.opening || !this._isOpenable()) {
        this.opening = false;
        return;
      }

      this._onBeforeOpen();
      const canceled = !this.dispatchEvent(
        new Event("open", { cancelable: true }),
      );
      if (canceled) {
        this.opening = false;
        this._onOpenCanceled();
        return;
      }

      this._showElement();
      await this._animate({ animate, opening: true });
      this.opening = false;
      this.dispatchEvent(new Event("opened"));
    }

    async close(options: BaseAnimateOptions = {}): Promise<void> {
      const { animate } = options;

      this.opening = false;
      if (!this.isConnected) {
        this._onNotConnectedClose();
        return;
      }

      this.closing = true;
      await this.updateComplete;
      if (this.opening || !this._isClosable()) {
        this.closing = false;
        this._onNotClosable();
        return;
      }

      this._onBeforeClose(options);
      const canceled = !this.dispatchEvent(
        new Event("close", { cancelable: true }),
      );
      if (canceled) {
        this.closing = false;
        this._onCloseCanceled();
        return;
      }

      await this._animate({ animate, opening: false });
      this.closing = false;
      this._closeElement();
      this.dispatchEvent(new Event("closed"));
    }
  }

  return AnimatedLitElement;
}
