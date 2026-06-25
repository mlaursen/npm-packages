import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import { NOT_DISABLED_OR_HIDDEN } from "../focus/constants.js";
import { requiredValidator } from "../form-control/required-validator.js";
import { InternalsMixin } from "../internals-mixin/internals-mixin.js";
import { loop } from "../utils/loop.js";
import { traverse } from "../utils/traverse.js";

const BaseRadioGroup = InternalsMixin(LitElement);

interface CheckableElement extends HTMLElement {
  checked: boolean;
  required: boolean;
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
export class RadioGroup extends BaseRadioGroup {
  static formAssociated = true;
  #syncFrame = 0;

  constructor() {
    super();

    this.internals.role = "radiogroup";
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "radiogroup");
    if (!this.hasAttribute("tabindex")) {
      this.tabIndex = -1;
    }

    this.addEventListener("change", this.#handleChange);
    this.addEventListener("keydown", this.#handleKeyDown);
    this.addEventListener("focusin", this.#handleFocusIn);
    this.addEventListener("focusout", this.#handleFocusOut);
    this.addEventListener("invalid", this.#handleInvalid);

    this.internals.form?.addEventListener("reset", this.#handleReset);

    // `queueMicrotask` did not work here so had to go for a full animation
    // frame
    this.#syncFrame = globalThis.requestAnimationFrame(() => {
      this.#syncTabIndices();
      this.#validate();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    globalThis.cancelAnimationFrame(this.#syncFrame);
    this.removeEventListener("change", this.#handleChange);
    this.removeEventListener("keydown", this.#handleKeyDown);
    this.removeEventListener("focusin", this.#handleFocusIn);
    this.removeEventListener("focusout", this.#handleFocusOut);

    this.internals.form?.removeEventListener("reset", this.#handleReset);
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

    this.#validate();
    const radios = this.#getRadios();
    for (const radio of radios) {
      radio.removeAttribute("aria-invalid");
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

    const radios = this.#getRadios("focusable");
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
      this.#validate();
      this.#updateValidity();
    });
  };

  #handleInvalid = (): void => {
    this.#updateValidity();
  };

  #validate(): void {
    const radios = this.#getRadios("required");
    if (radios.length === 0) {
      return;
    }

    for (const radio of radios) {
      if (radio.checked || radio.ariaChecked === "true") {
        this.internals.setValidity();
        this.#updateValidity();
        return;
      }
    }

    this.internals.setValidity(
      { valueMissing: true },
      requiredValidator.message,
      radios[0],
    );
  }

  #updateValidity = (): void => {
    const radios = this.#getRadios("required");
    const valid = this.internals.validity.valid;
    for (const radio of radios) {
      if (valid) {
        radio.removeAttribute("aria-invalid");
      } else {
        radio.setAttribute("aria-invalid", "true");
      }
    }
  };

  #getRadios(
    state: "any" | "focusable" | "required" = "any",
  ): readonly CheckableElement[] {
    let query = '[role="radio"]';
    if (state === "focusable") {
      query += NOT_DISABLED_OR_HIDDEN;
    } else if (state === "required") {
      query += ":is([required], [aria-required=true])";
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
