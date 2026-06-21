import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
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

  @property({ type: Number })
  rows?: number;

  @property({ type: Number })
  cols?: number;

  #fieldId = "field";

  @query("#field")
  _field?: HTMLInputElement | HTMLTextAreaElement;

  @query(".notch-2")
  _notchWithLabel?: HTMLDivElement;

  @query(".resize")
  _resize?: HTMLDivElement;

  #resizeObserver?: ResizeObserver;

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

    if (changed.has("_hasLabel")) {
      this.toggleAttribute("has-label", this._hasLabel);
    }
  }

  override focus(options?: FocusOptions): void {
    this._field?.focus(options);
  }

  select(): void {
    this._field?.select();
  }

  get selectionDirection(): "none" | "forward" | "backward" | null {
    return this._field?.selectionDirection ?? null;
  }
  set selectionDirection(value: "none" | "forward" | "backward" | null) {
    if (this._field) {
      this._field.selectionDirection = value;
    }
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

  get valueAsNumber(): number {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return Number.NaN;
    }

    return input.valueAsNumber;
  }
  set valueAsNumber(value: number) {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.valueAsNumber = value;
    this.value = input.value;
  }

  get valueAsDate(): Date | null {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return null;
    }

    return input.valueAsDate;
  }
  set valueAsDate(value: Date | null) {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.valueAsDate = value;
    this.value = input.value;
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

  protected override firstUpdated(changed: PropertyValues): void {
    super.firstUpdated(changed);

    if (!this._resize) {
      return;
    }

    let observedOnce = false;
    this.#resizeObserver = new ResizeObserver((entries) => {
      if (!observedOnce) {
        observedOnce = true;
        return;
      }

      const resize = this._resize;
      const entry = entries[0];
      if (!resize || entry?.target !== resize) {
        return;
      }

      const { width, height } = entry.contentRect;
      this.style.width = `${width}px`;
      this.style.height = `${height}px`;
      const nextRect = this.getBoundingClientRect();

      this.style.width = `${nextRect.width}px`;
      this.style.height = `${nextRect.height}px`;
      resize.style.width = this.style.width;
      resize.style.height = this.style.height;
    });
    this.#resizeObserver.observe(this._resize);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#resizeObserver?.disconnect();
  }

  override render(): TemplateResult {
    return html`${this.#renderLabel()}${this.#renderInput()}${this.#renderTextArea()}${this.#renderOutline()}`;
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
        class="input ${classMap({ labeled: this._hasLabel })}"
        type=${this.type}
        name=${ifDefined(this.name || undefined)}
        inputmode=${this.inputMode}
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
        .value=${live(this.value)}
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

    // NOTE: remove the `as "on"` typecast for autocomplete once `ts-plugin-lit` is updated
    return html`
      <textarea
        id=${this.#fieldId}
        class="input ${classMap({ labeled: this._hasLabel })}"
        name=${ifDefined(this.name || undefined)}
        autocomplete=${ifDefined(this.autocomplete || undefined) as "on"}
        autocapitalize=${ifDefined(this.autocapitalize || undefined)}
        placeholder=${ifDefined(this.placeholder || undefined)}
        ?required=${this.required}
        ?readonly=${this.readOnly}
        ?disabled=${this.disabled}
        ?multiple=${this.multiple}
        rows=${ifDefined(this.rows)}
        cols=${ifDefined(this.cols)}
        maxlength=${ifDefined(this.maxLength)}
        minlength=${ifDefined(this.minLength)}
        .value=${live(this.value)}
        @focus=${this.#handleFocusChange}
        @blur=${this.#handleFocusChange}
        @input=${this.#handleInput}
      ></textarea>
      <div class="resize"></div>
    `;
  }

  #renderOutline(): TemplateResult | null {
    if (this.variant !== "outlined") {
      return null;
    }

    // this is an interesting one... I can't dynamically render the inner
    // notches since the lit comment breaks the `display: grid` styling
    const isGapRequired = this._hasLabel; // && this.shape === "square";
    return html`
      <div
        aria-hidden="true"
        class="outline ${classMap({ "no-notches": !isGapRequired })}"
      >
        <div class="notch-1" ?hidden=${!isGapRequired}></div>
        <div class="notch-2" ?hidden=${!isGapRequired}></div>
        <div class="notch-3" ?hidden=${!isGapRequired}></div>
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
