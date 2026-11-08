import { property } from "lit/decorators.js";

import type { LitConstructor } from "../types.js";
import { AnimateMixin } from "./animate-mixin.js";
import type {
  AnimationOptions,
  OpenCloseAnimatedElementProperties,
  AnimationList,
  BaseAnimationOptions,
} from "./types.js";

/**
 * The `OpenCloseAnimateMixin` is used to add a toggleable animation usually based on an
 * `open` state that is controlled with the
 * {@link OpenCloseAnimatedElementProperties.show} and
 * {@link OpenCloseAnimatedElementProperties.close} methods.
 *
 * The extending class should override the
 * {@link OpenCloseAnimatedElementProperties._getAnimations} function to define the
 * animations.
 *
 * @see {@link AnimateMixin} for more information around the animations.
 *
 * @fires {Event} open - Fired before the show animation occurs and can be used
 * to cancel opening the element by calling `event.preventDefault()`.
 * @fires {Event} opened - Fired once the element has opened and the animations
 * have completed.
 * @fires {Event} close - Fired before the hide animation occurs and can be
 * used to cancel closing the element by calling `event.preventDefault()`.
 * @fires {Event} closed - Fired once the element has closed and the animations
 * have completed.
 */
export function OpenCloseAnimateMixin<T extends LitConstructor>(
  Base: T,
): T & LitConstructor<OpenCloseAnimatedElementProperties> {
  class OpenCloseAnimatedLitElement
    extends AnimateMixin(Base)
    implements OpenCloseAnimatedElementProperties
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
    _onBeforeClose(_options: BaseAnimationOptions): void {}
    _onCloseCanceled(): void {}
    _onNotConnectedClose(): void {}
    _onNotClosable(): void {}

    override _getAnimations(_options: AnimationOptions): AnimationList {
      return [];
    }

    override _animate(options: AnimationOptions): Promise<void> {
      return super._animate(options);
    }

    async show(options: BaseAnimationOptions = {}): Promise<void> {
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

    async close(options: BaseAnimationOptions = {}): Promise<void> {
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

  return OpenCloseAnimatedLitElement;
}
