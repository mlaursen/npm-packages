import { type TemplateResult, html, isServer } from "lit";
import { property, query } from "lit/decorators.js";

import type { LitConstructor } from "../types.js";
import type { FocusTrapProperties } from "./types.js";
import { isFocusable } from "./utils.js";

export function FocusTrapMixin<T extends LitConstructor>(
  Base: T,
): T & LitConstructor<FocusTrapProperties> {
  class FocusTrapElement extends Base implements FocusTrapProperties {
    #treewalker = isServer
      ? null
      : document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT);

    @property({ type: Boolean, attribute: "disable-focus-trap" })
    disableFocusTrap?: boolean;

    @query(".focus-trap")
    private _firstFocusTrap?: HTMLDivElement;

    getFallbackFocus(): HTMLElement | null | undefined {
      return null;
    }

    renderFocusTrap(): TemplateResult | null {
      if (this.disableFocusTrap) {
        return null;
      }

      return html`
        <div
          class="focus-trap"
          @focus=${this.#handleFocus}
          tabindex="0"
          aria-hidden="true"
        ></div>
      `;
    }

    #handleFocus(event: FocusEvent): void {
      if (!this.#treewalker) {
        return;
      }

      let firstFocusableChild: HTMLElement | undefined;
      let lastFocusableChild: HTMLElement | undefined;

      this.#treewalker.currentNode = this.#treewalker.root;
      while (this.#treewalker.nextNode()) {
        const node = this.#treewalker.currentNode;
        if (isFocusable(node)) {
          firstFocusableChild ??= node;
          lastFocusableChild = node;
        }
      }

      if (!firstFocusableChild && !lastFocusableChild) {
        this.getFallbackFocus()?.focus();
        return;
      }

      const isFirstFocusTrap = event.currentTarget === this._firstFocusTrap;
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
