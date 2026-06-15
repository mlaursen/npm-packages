import { type TemplateResult, html } from "lit";
import { property, query } from "lit/decorators.js";

import { type LitConstructor } from "../types.js";
import { isWithinRoot } from "../utils/traverse.js";
import { type FocusTrapProperties } from "./types.js";
import { getAutoFocusElement, getFocusableElements } from "./utils.js";

export function FocusTrapMixin<T extends LitConstructor>(
  Base: T,
): T & LitConstructor<FocusTrapProperties> {
  class FocusTrapElement extends Base implements FocusTrapProperties {
    @property({ type: Boolean, attribute: "disable-focus-trap" })
    disableFocusTrap?: boolean;

    @query("#first-focus-trap")
    private _firstFocusTrap?: HTMLDivElement;

    @query("#last-focus-trap")
    private _lastFocusTrap?: HTMLDivElement;

    #reversed = false;

    override connectedCallback(): void {
      super.connectedCallback();

      this.addEventListener("keydown", this.#handleKeyDown);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.removeEventListener("keydown", this.#handleKeyDown);
    }

    getFallbackFocus(): HTMLElement | null | undefined {
      return null;
    }

    renderFocusTrap(position: "first" | "last"): TemplateResult | null {
      if (this.disableFocusTrap) {
        return null;
      }

      return html`
        <div
          id="${position}-focus-trap"
          @focus=${this.#handleFocus}
          tabindex="0"
          aria-hidden="true"
        ></div>
      `;
    }

    focusFirstAutoFocus(): void {
      const element = getAutoFocusElement(this);
      element?.focus();
    }

    #handleFocus(event: FocusEvent): void {
      if (!this._firstFocusTrap || !this._lastFocusTrap) {
        return;
      }

      const focusables = getFocusableElements(
        this,
        this._firstFocusTrap,
        this._lastFocusTrap,
      );
      const firstFocusableChild = focusables.at(0);
      const lastFocusableChild = focusables.at(-1);

      if (!firstFocusableChild && !lastFocusableChild) {
        this.getFallbackFocus()?.focus();
        return;
      }

      let target: HTMLElement | undefined;
      if (
        event.relatedTarget === this.getFallbackFocus() ||
        !(event.relatedTarget instanceof Node) ||
        !isWithinRoot(this, event.relatedTarget)
      ) {
        target = this.#reversed ? lastFocusableChild : firstFocusableChild;
      } else if (event.currentTarget === this._firstFocusTrap) {
        target = lastFocusableChild;
      } else if (event.currentTarget === this._lastFocusTrap) {
        target = firstFocusableChild;
      }

      target?.focus();
    }

    #handleKeyDown(event: KeyboardEvent): void {
      this.#reversed = event.shiftKey && event.key === "Tab";
    }
  }

  return FocusTrapElement;
}
