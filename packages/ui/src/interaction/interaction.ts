import { type CSSResultArray, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import {
  type StylableLitElement,
  type StyledLitElementWithProperties,
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

    @property({ reflect: true })
    interaction: InteractionDirection = "outward";

    @property({ reflect: true, type: Boolean })
    disabled = false;

    protected override willUpdate(changed: PropertyValues): void {
      if (changed.has("disabled")) {
        const tabIndex = this.disabled ? "-1" : "0";
        this.setAttribute("tabIndex", tabIndex);
      }
    }
  }

  return InteractionElement;
}
