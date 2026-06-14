import { type LitElement, isServer } from "lit";
import { property } from "lit/decorators.js";

import { type LitConstructor } from "../types.js";
import {
  type AriaMixinProperties,
  type AriaRole,
  type LitElementWithAriaProperties,
} from "./types.js";

/**
 * This is hopefully a temporary workaround until the accessibility object
 * model is complete. The browser correctly reports the role with the internals
 * to screen readers, but there is no way for test frameworks like `playwright`
 * or `@testing-library/react` to access it to get by role.
 *
 * So this mixin just initializes the `ElementInternals` in the browser and
 * reflects the `role` so those test libraries can find it.
 */
export function AriaMixin<
  T extends LitConstructor<LitElement & { disabled?: boolean | null }>,
>(
  Base: T,
  role: AriaRole,
  formAssociated = true,
): LitElementWithAriaProperties<T> {
  class AriaElement extends Base implements AriaMixinProperties {
    @property({ reflect: true })
    override role: AriaRole = role;

    static formAssociated = formAssociated;

    internals?: ElementInternals;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      if (isServer) {
        return;
      }

      this.internals = this.attachInternals();
      this.internals.role = role;
    }

    override connectedCallback(): void {
      super.connectedCallback();

      this.addEventListener("click", this.handleClick, true);
      this.addEventListener("keydown", this.handleKeyDown);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      // NOTE: Unlike with React, you will be unable to call
      // `event.preventDefault()` or `event.stopPropagation()` on a custom
      // `@click` or `addEventListener("click")` handler
      this.removeEventListener("click", this.handleClick, true);
      this.removeEventListener("keydown", this.handleKeyDown);
    }

    isDisabled(): boolean {
      return this.disabled || this.ariaDisabled === "true";
    }

    handleClick(event: MouseEvent): void {
      if (this.isDisabled()) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      // do not scroll the page
      if (event.key === " ") {
        event.preventDefault();
      }

      // since I won't remember this, for some reason `this.click()` won't work
      // like how it did for React so a new event must be dispatched.
      this.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
    }
  }

  return AriaElement;
}
