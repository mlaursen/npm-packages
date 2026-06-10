import { type TemplateResult, html, isServer } from "lit";
import { property, query } from "lit/decorators.js";

import type { LitConstructor } from "../types.js";
import type { FocusTrapProperties } from "./types.js";
import { isFocusable } from "./utils.js";

export function FocusTrapMixin<T extends LitConstructor>(
  Base: T,
): T & LitConstructor<FocusTrapProperties> {
  class FocusTrapElement extends Base implements FocusTrapProperties {
    #treeWalker = isServer
      ? null
      : document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT);

    @property({ type: Boolean, attribute: "disable-focus-trap" })
    disableFocusTrap?: boolean;

    @query("#first-focus-trap")
    private _firstFocusTrap?: HTMLDivElement;

    @query("#last-focus-trap")
    private _lastFocusTrap?: HTMLDivElement;

    getFallbackFocus(): HTMLElement | null | undefined {
      return null;
    }

    renderFocusTrap(last: boolean): TemplateResult | null {
      if (this.disableFocusTrap) {
        return null;
      }

      return html`
        <div
          id="${last ? "last" : "first"}-focus-trap"
          @focus=${this.#handleFocus}
          tabindex="0"
          aria-hidden="true"
        ></div>
      `;
    }

    #handleFocus(event: FocusEvent): void {
      const root = this._firstFocusTrap?.parentNode;
      if (
        !this.#treeWalker ||
        !this._firstFocusTrap ||
        !this._lastFocusTrap ||
        !root
      ) {
        return;
      }

      let firstFocusableChild: HTMLElement | undefined;
      let lastFocusableChild: HTMLElement | undefined;

      this.#treeWalker.currentNode = root;
      while (this.#treeWalker.nextNode()) {
        const node = this.#treeWalker.currentNode;
        if (
          node !== this._firstFocusTrap &&
          node !== this._lastFocusTrap &&
          isFocusable(node)
        ) {
          firstFocusableChild ??= node;
          lastFocusableChild = node;
        }
      }

      const isFirstFocusTrap = event.currentTarget === this._firstFocusTrap;
      if (!firstFocusableChild && !lastFocusableChild) {
        this.getFallbackFocus()?.focus();
        return;
      }

      const isLastFocusTrap = !isFirstFocusTrap;
      const isFromFirstFocusableChild =
        event.relatedTarget === firstFocusableChild;
      const isFromLastFocusableChild =
        event.relatedTarget === lastFocusableChild;
      const isFromOutside =
        !isFromFirstFocusableChild && !isFromLastFocusableChild;

      if (
        (isLastFocusTrap && isFromLastFocusableChild) ||
        (isFirstFocusTrap && isFromOutside)
      ) {
        firstFocusableChild?.focus();
      } else if (
        (isFirstFocusTrap && isFromFirstFocusableChild) ||
        (isLastFocusTrap && isFromOutside)
      ) {
        lastFocusableChild?.focus();
      }
    }
  }

  return FocusTrapElement;
}
