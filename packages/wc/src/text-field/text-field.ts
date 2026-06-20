import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import { isSlotted } from "../utils/slots.js";
import styles from "./text-field-styles.js";
import type {
  AutoCapitalize,
  SupportedInputType,
  TextFieldProperties,
  TextFieldShape,
  TextFieldSize,
  TextFieldVariant,
  UnsupportedInputType,
} from "./types.js";

const BaseTextField = PaletteMixin(MarginMixin(LitElement));

export class TextField extends BaseTextField implements TextFieldProperties {
  static override styles = [...BaseTextField.styles, styles];
  static formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    ...BaseTextField.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ reflect: true })
  variant: TextFieldVariant = "outlined";

  @property()
  size: TextFieldSize = "normal";

  @property()
  shape: TextFieldShape = "square";

  @property()
  type: SupportedInputType | UnsupportedInputType = "text";

  @property()
  name = "";

  @property()
  value = "";

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  error = false;

  @property()
  autocomplete: AutoFill = "";

  @property()
  override autocapitalize: AutoCapitalize = "";

  @property()
  min = "";

  @property()
  max = "";

  @property({ type: Number })
  step?: number;

  @property({ type: Number })
  minLength?: number;

  @property({ type: Number })
  maxLength?: number;

  @property()
  pattern = "";

  @property()
  placeholder = "";

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Boolean, attribute: "readonly" })
  readOnly = false;

  @property({ type: Boolean })
  required = false;

  #fieldId = "field";

  @query("#field")
  _field?: HTMLInputElement | HTMLTextAreaElement;

  @query(".notch-2")
  _notchWithLabel?: HTMLDivElement;

  @property({ type: Boolean, reflect: true, attribute: "focus-visible" })
  focusVisible = false;

  @property({ type: Boolean, reflect: true, attribute: "floating" })
  floating = !!this.value;

  @state()
  _hasLabel = false;

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("value") || changed.has("focusVisible")) {
      this.floating = !!this.value || this.focusVisible;
    }
  }

  override render(): TemplateResult {
    return html`${this.#renderLabel()}${this.#renderInput()}${this.#renderTextArea()}${this.#renderOutline()}`;
  }

  override focus(options?: FocusOptions): void {
    this._field?.focus(options);
  }

  select(): void {
    this._field?.select();
  }

  get selectionStart(): number | null {
    return this._field?.selectionStart ?? null;
  }
  set selectionStart(selectionStart: number | null) {
    if (this._field) {
      this._field.selectionStart = selectionStart;
    }
  }

  get selectionEnd(): number | null {
    return this._field?.selectionEnd ?? null;
  }
  set selectionEnd(selectionEnd: number | null) {
    if (this._field) {
      this._field.selectionEnd = selectionEnd;
    }
  }

  showPicker(): void {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.showPicker();
  }

  stepUp(amount?: number): void {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.stepUp(amount);
  }

  stepDown(amount?: number): void {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.stepDown(amount);
  }

  setSelectionRange(
    start: number | null,
    end: number | null,
    direction?: "forward" | "backward" | "none",
  ): void {
    this._field?.setSelectionRange(start, end, direction);
  }

  /**
   * Replaces a range of text with a new string.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setRangeText
   */
  setRangeText(replacement: string): void;
  setRangeText(
    replacement: string,
    start: number,
    end: number,
    selectionMode?: SelectionMode,
  ): void;
  setRangeText(...args: unknown[]): void {
    this._field?.setRangeText(
      ...(args as Parameters<HTMLInputElement["setRangeText"]>),
    );
  }

  #renderLabel(): TemplateResult {
    return html`
      <label for=${this.#fieldId} ?hidden=${!this._hasLabel} class="label">
        <slot name="label" @slotchange=${this.#handleLabelSlotChange}></slot>
      </label>
    `;
  }

  #renderInput(): TemplateResult | null {
    if (this.type === "textarea") {
      return null;
    }

    // NOTE: remove the `as "on"` typecast for autocomplete once `ts-plugin-lit` is updated
    return html`
      <input
        id=${this.#fieldId}
        class="input"
        type=${this.type}
        .value=${live(this.value)}
        autocomplete=${ifDefined(this.autocomplete || undefined) as "on"}
        autocapitalize=${ifDefined(this.autocapitalize || undefined)}
        pattern=${ifDefined(this.pattern || undefined)}
        placeholder=${ifDefined(this.placeholder || undefined)}
        ?required=${this.required}
        ?readonly=${this.readOnly}
        ?disabled=${this.disabled}
        ?multiple=${this.multiple}
        min=${ifDefined(this.min || undefined)}
        max=${ifDefined(this.max || undefined)}
        step=${ifDefined(this.step)}
        maxlength=${ifDefined(this.maxLength)}
        minlength=${ifDefined(this.minLength)}
        @focus=${this.#handleFocusChange}
        @blur=${this.#handleFocusChange}
        @input=${this.#handleInput}
      />
    `;
  }

  #renderTextArea(): TemplateResult | null {
    if (this.type !== "textarea") {
      return null;
    }

    return html``;
  }

  #renderOutline(): TemplateResult | null {
    if (this.variant !== "outlined") {
      return null;
    }

    return html`
      <div aria-hidden="true" class="outline">
        <div class="notch-1"></div>
        <div class="notch-2"></div>
        <div class="notch-3"></div>
      </div>
    `;
  }

  #handleLabelSlotChange(event: Event): void {
    const elements =
      (event.currentTarget as HTMLSlotElement | null)?.assignedElements({
        flatten: true,
      }) ?? [];
    this._hasLabel = elements.length > 0;

    if (this._notchWithLabel && this.variant === "outlined") {
      this._notchWithLabel.replaceChildren();
      for (const element of elements) {
        this._notchWithLabel.append(element.cloneNode(true));
      }
    }
  }

  #handleInput(event: InputEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    this.value = target.value;
  }

  #handleFocusChange(): void {
    this.focusVisible = this._field?.matches(":focus-visible") ?? false;
  }
}
