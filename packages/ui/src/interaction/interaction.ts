import { type CSSResultArray } from "lit";
import { property } from "lit/decorators.js";

import type {
  StylableLitElement,
  StyledLitElementWithProperties,
} from "../types.js";
import interactionStyles from "./interaction-styles.js";
import {
  type InteractionDirection,
  type InteractionProperties,
} from "./types.js";

export function InteractionMixin<T extends StylableLitElement>(
  Base: T,
): StyledLitElementWithProperties<InteractionProperties, T> {
  let styles: CSSResultArray = [interactionStyles];
  if (Base.styles) {
    const baseStyles = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    styles = [interactionStyles, ...baseStyles];
  }

  class InteractionElement extends Base {
    static override styles = styles;
    static override shadowRootOptions: ShadowRootInit = {
      mode: "open",
      ...Base.shadowRootOptions,
      delegatesFocus: true,
    };

    @property({ reflect: true })
    interaction: InteractionDirection = "outward";

    override connectedCallback(): void {
      super.connectedCallback();

      this.addEventListener("focusin", this.#handleFocusIn);
      this.addEventListener("focusout", this.#handleFocusOut);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("focusin", this.#handleFocusIn);
      this.removeEventListener("focusout", this.#handleFocusOut);
    }

    focusTarget?: Element | null;

    #handleFocusIn(event: FocusEvent): void {
      const target = event.target;
      if (
        target instanceof Element &&
        (target.matches(":focus-visible") ||
          this.focusTarget?.matches(":focus-visible"))
      ) {
        this.setAttribute("focus-visible", "");
      }
    }

    #handleFocusOut(): void {
      this.removeAttribute("focus-visible");
    }
  }

  return InteractionElement;
}
