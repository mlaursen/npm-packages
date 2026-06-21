import { type TemplateResult, html, isServer } from "lit";
import { customElement } from "lit/decorators.js";

import { Box } from "../box/box.js";
import { NOT_DISABLED_OR_HIDDEN } from "../focus/constants.js";
import { loop } from "../utils/loop.js";
import { traverse } from "../utils/traverse.js";

interface CheckableElement extends HTMLElement {
  checked: boolean;
}

/**
 * The `mwc-radio-group` is used to control the checked and focus state for a
 * list of radios. This should generally have an `aria-label` or
 * `aria-labelledby` for accessibility.
 *
 * @example Main Example
 * ```ts
 * <mwc-radio-group aria-label="Fruits">
 *   <mwc-typography variant="label"><label for="radio-1">Apple</label></mwc-typography>
 *   <mwc-radio id="radio-1" name="fruits" value="apple" checked></mwc-radio>
 *   <mwc-typography variant="label"><label for="radio-2">Banana</label></mwc-typography>
 *   <mwc-radio id="radio-2" name="fruits" value="banana"></mwc-radio>
 *   <mwc-typography variant="label"><label for="radio-3">Clementine</label></mwc-typography>
 *   <mwc-radio id="radio-3" name="fruits" value="clementine"></mwc-radio>
 * </mwc-radio-group>
 * ```
 */
@customElement("mwc-radio-group")
export class RadioGroup extends Box {
  static formAssociated = true;

  #internals = this.attachInternals();

  constructor() {
    super();

    this.#internals.role = "radiogroup";
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "radiogroup");
    this.addEventListener("change", this.#handleChange);
    this.addEventListener("keydown", this.#handleKeyDown);
    this.addEventListener("focusin", this.#handleFocusIn);
    this.addEventListener("focusout", this.#handleFocusOut);

    this.#internals.form?.addEventListener("reset", this.#handleReset);
    queueMicrotask(() => {
      this.#syncTabIndices();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("change", this.#handleChange);
    this.removeEventListener("keydown", this.#handleKeyDown);
    this.removeEventListener("focusin", this.#handleFocusIn);
    this.removeEventListener("focusout", this.#handleFocusOut);

    this.#internals.form?.removeEventListener("reset", this.#handleReset);
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  #getRadioFromEvent(event: Event): CheckableElement | null {
    const { target } = event;
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    return target.closest<CheckableElement>('[role="radio"]');
  }

  #handleChange = (event: Event): void => {
    const checkedRadio = this.#getRadioFromEvent(event);
    if (!checkedRadio) {
      return;
    }

    const radios = this.#getRadios();
    for (const radio of radios) {
      if (radio === checkedRadio) {
        radio.tabIndex = 0;
      } else {
        radio.checked = false;
        radio.tabIndex = -1;
      }
    }
  };

  #handleKeyDown = (event: KeyboardEvent): void => {
    const isLeft = event.key === "ArrowLeft";
    const isRight = event.key === "ArrowRight";
    const isUp = event.key === "ArrowUp";
    const isDown = event.key === "ArrowDown";

    if (!isLeft && !isRight && !isUp && !isDown) {
      return;
    }

    const radio = this.#getRadioFromEvent(event);
    if (!radio) {
      return;
    }

    const radios = this.#getRadios(true);
    const isRTL = getComputedStyle(this).direction === "rtl";
    const increment = isDown || (isRTL ? isLeft : isRight);

    const checkedIndex = loop({
      value: radios.indexOf(radio),
      max: radios.length - 1,
      increment,
    });
    const checked = radios[checkedIndex];
    if (checked) {
      event.preventDefault();
      checked.checked = true;
      checked.focus();
      checked.dispatchEvent(
        new Event("change", { bubbles: true, composed: true }),
      );
    }
  };

  #syncTabIndices(): void {
    const radios = this.#getRadios();
    const checked = radios.find((radio) => radio.checked);

    for (const radio of radios) {
      radio.tabIndex = !checked || radio === checked ? 0 : -1;
    }
  }

  #handleFocusIn = (event: FocusEvent): void => {
    const focusedRadio = this.#getRadioFromEvent(event);
    if (!focusedRadio) {
      return;
    }

    const radios = this.#getRadios();
    for (const radio of radios) {
      radio.tabIndex = radio === focusedRadio ? 0 : -1;
    }
  };

  #handleFocusOut = (event: FocusEvent): void => {
    if (
      !(event.relatedTarget instanceof HTMLElement) ||
      this.contains(event.relatedTarget)
    ) {
      return;
    }

    const radios = this.#getRadios();
    if (radios.some((radio) => radio.checked)) {
      return;
    }

    for (const radio of radios) {
      radio.tabIndex = 0;
    }
  };

  #handleReset = (): void => {
    // wait for the radios to reset their checked states before updating the
    // tab indexes
    queueMicrotask(() => {
      this.#syncTabIndices();
    });
  };

  #getRadios(focusable = false): readonly CheckableElement[] {
    let query = '[role="radio"]';
    if (focusable) {
      query += NOT_DISABLED_OR_HIDDEN;
    }

    return traverse({
      root: this,
      check: (node): node is CheckableElement =>
        node instanceof HTMLElement && node.matches(query),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-radio-group": RadioGroup;
  }
}
