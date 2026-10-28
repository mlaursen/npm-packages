import type { LitConstructor } from "../types.js";
import type {
  LitElementWithScrollLockProperties,
  ScrollLockProperties,
} from "./types.js";

/**
 * This mixin is used to enable scroll locking for the document and generally used
 * with the `PopoverMixin`.
 */
export function ScrollLockMixin<T extends LitConstructor>(
  Base: T,
): LitElementWithScrollLockProperties<T> {
  class ScrollLockableElement extends Base implements ScrollLockProperties {
    #enabledScrollLock = false;

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this._scrollLock(false);
    }

    _scrollLock(lock: boolean): void {
      const rootEl = document.documentElement;
      if (lock) {
        if (rootEl.inert || rootEl.style.overflow) {
          return;
        }

        this.#enabledScrollLock = true;
        rootEl.inert = true;
        rootEl.style.overflow = "hidden";
      } else if (this.#enabledScrollLock) {
        rootEl.inert = false;
        rootEl.style.removeProperty("overflow");
      }
    }
  }

  return ScrollLockableElement;
}
