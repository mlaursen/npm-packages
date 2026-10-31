import type { PropertyValues } from "lit";

import type { LitConstructorWithObservedAttributes } from "../types.js";
import { ARIA_ATTRIBUTES, MIRRORED_ARIA_ATTRIBUTES } from "./constants.js";
import type { LitElementWithDelegateAriaProperties } from "./types.js";

const PREFIX_LENGTH = "aria-".length;

/**
 * This mixin is required since the browser doesn't currently support `aria-*`
 * attributes in shadow dom. So this mixin will move the non-id ref aria
 * attributes down to the {@link DelegateAriaElement.delegateAriaTarget}. It
 * will also rename some of the attributes to be `data-${name}` since they can
 * change styles.
 */
export function DelegateAriaMixin<
  T extends LitConstructorWithObservedAttributes,
>(Base: T): LitElementWithDelegateAriaProperties<T> {
  class DelegateAriaElement extends Base {
    static override get observedAttributes() {
      return [...super.observedAttributes, ...ARIA_ATTRIBUTES];
    }

    #aria = new Map<string, string>();
    #removing = false;

    override attributeChangedCallback(
      name: string,
      old: string | null,
      value: string | null,
    ): void {
      if (!ARIA_ATTRIBUTES.has(name)) {
        return super.attributeChangedCallback(name, old, value);
      }

      if (this.#removing || value === null) {
        return;
      }

      this.#aria.set(name, value);
      this.requestUpdate();

      if (MIRRORED_ARIA_ATTRIBUTES.has(name)) {
        const dataName = `data-${name.slice(PREFIX_LENGTH)}`;
        if (value === "") {
          this.removeAttribute(dataName);
        } else {
          this.setAttribute(dataName, value);
        }
      }

      this.#removing = true;
      this.removeAttribute(name);
      this.#removing = false;
    }

    protected override updated(changed: PropertyValues): void {
      super.updated(changed);

      const target = this.delegateAriaTarget;
      if (!target) {
        return;
      }

      for (const [name, value] of this.#aria) {
        if (value === "") {
          target.removeAttribute(name);
        } else {
          target.setAttribute(name, value);
        }
      }
    }

    protected get delegateAriaTarget(): HTMLElement | null {
      return null;
    }
  }

  return DelegateAriaElement as unknown as LitElementWithDelegateAriaProperties<T>;
}
