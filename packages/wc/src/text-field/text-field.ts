import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";

import { FormControlMixin } from "../form-control/form-control-mixin.js";
import { maxLengthValidator } from "../form-control/max-length-validator.js";
import { minLengthValidator } from "../form-control/min-length-validator.js";
import { patternValidator } from "../form-control/pattern-validator.js";
import { requiredValidator } from "../form-control/required-validator.js";
import { InternalsMixin } from "../internals-mixin/internals-mixin.js";
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

const BaseStyledTextField = PaletteMixin(MarginMixin(LitElement));
const BaseTextField = FormControlMixin(InternalsMixin(BaseStyledTextField));

/**
 * This version of the text field should generally not be used and the
 * `mwc-filled-text-field` or `mwc-outlined-text-field` should be used instead.
 */
@customElement("mwc-text-field")
export class TextField extends BaseTextField implements TextFieldProperties {
  static override styles = [...BaseTextField.styles, styles];
  static override formControlValidators = [
    requiredValidator,
    minLengthValidator,
    maxLengthValidator,
    patternValidator,
  ];

  static override shadowRootOptions: ShadowRootInit = {
    ...BaseTextField.shadowRootOptions,
    delegatesFocus: true,
  };

  static formAssociated = true;

  @property({ reflect: true })
  variant: TextFieldVariant = "outlined";

  @property()
  size: TextFieldSize = "normal";

  @property()
  shape: TextFieldShape = "square";

  /**
   * The **`type`** property of the HTMLInputElement interface indicates the kind of data allowed in the input element, for example a number, a date, or an email.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/type)
   */
  @property()
  type: SupportedInputType | UnsupportedInputType = "text";

  /**
   * The **`name`** property of the HTMLInputElement interface indicates the name of the input element.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/name)
   */
  @property()
  name = "";

  /**
   * The **`value`** property of the HTMLInputElement interface represents the current value of the input element as a string.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/value)
   */
  @property()
  override value = "";

  /**
   * The **`autocomplete`** property of the HTMLInputElement interface indicates whether the value of the form's controls can be automatically completed by the browser.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/autocomplete)
   */
  @property()
  autocomplete: AutoFill = "";

  /**
   * The **`autocapitalize`** property of the HTMLElement interface represents the element's capitalization behavior for user input.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocapitalize)
   */
  @property()
  override autocapitalize: AutoCapitalize = "";

  /**
   * The **`min`** property of the HTMLInputElement interface reflects the input element's `min` attribute, which generally defines the minimum valid value for a numeric or date-time input.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/min)
   */
  @property()
  min = "";

  /**
   * The **`max`** property of the HTMLInputElement interface reflects the input element's `max` attribute, which generally defines the maximum valid value for a numeric or date-time input.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/max)
   */
  @property()
  max = "";

  /**
   * The **`step`** property of the HTMLInputElement interface indicates the step by which numeric or date-time input elements can change.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/step)
   */
  @property({ type: Number })
  step?: number;

  /**
   * The **`minLength`** property of the HTMLInputElement interface indicates the minimum number of characters (in UTF-16 code units) required for the value of the input element to be valid.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/minLength)
   */
  @property({ type: Number })
  minLength = -1;

  /**
   * The **`maxLength`** property of the HTMLInputElement interface indicates the maximum number of characters (in UTF-16 code units) allowed to be entered for the value of the input element, and the maximum number of characters allowed for the value to be valid.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/maxLength)
   */
  @property({ type: Number })
  maxLength = -1;

  /**
   * The **`pattern`** property of the HTMLInputElement interface represents a regular expression a non-null input value should match.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/pattern)
   */
  @property()
  pattern = "";

  /**
   * The **`placeholder`** property of the HTMLInputElement interface represents a hint to the user of what can be entered in the control.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/placeholder)
   */
  @property()
  placeholder = "";

  /**
   * The **`HTMLInputElement.multiple`** property indicates if an input can have more than one value.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/multiple)
   */
  @property({ type: Boolean })
  multiple = false;

  /**
   * The **`rows`** property of the HTMLTextAreaElement interface is a positive integer representing the visible text lines of the text control.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/rows)
   */
  @property({ type: Number })
  rows?: number;

  /**
   * The **`cols`** property of the HTMLTextAreaElement interface is a positive integer representing the visible width of the multi-line text control, in average character widths.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/cols)
   */
  @property({ type: Number })
  cols?: number;

  @state()
  _hasLabel = false;

  @property({ type: Boolean, reflect: true, attribute: "focus-visible" })
  focusVisible = false;

  @property({ type: Boolean, reflect: true, attribute: "floating" })
  floating = !!this.value;

  #fieldId = "field";
  #resizeObserver?: ResizeObserver;
  #observedOnce = false;

  @query("#field")
  _field?: HTMLInputElement | HTMLTextAreaElement;

  @query(".notch-2")
  _notchWithLabel?: HTMLDivElement;

  @query(".resize")
  _resize?: HTMLDivElement;

  /**
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus)
   */
  override focus(options?: FocusOptions): void {
    this._field?.focus(options);
  }

  /**
   * The **`HTMLInputElement.select()`** method selects all the text in a textarea element or in an input element that includes a text field.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/select)
   */
  select(): void {
    this._field?.select();
  }

  /**
   * The **`selectionDirection`** property of the HTMLInputElement interface is a string that indicates the direction in which the user is selecting the text.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/selectionDirection)
   */
  get selectionDirection(): "none" | "forward" | "backward" | null {
    return this._field?.selectionDirection ?? null;
  }
  set selectionDirection(value: "none" | "forward" | "backward" | null) {
    if (this._field) {
      this._field.selectionDirection = value;
    }
  }

  /**
   * @inheritdoc HTMLInputElement.selectionStart
   */
  get selectionStart(): number | null {
    return this._field?.selectionStart ?? null;
  }
  set selectionStart(selectionStart: number | null) {
    if (this._field) {
      this._field.selectionStart = selectionStart;
    }
  }

  /**
   * The **`selectionEnd`** property of the HTMLInputElement interface is a number that represents the end index of the selected text.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/selectionEnd)
   */
  get selectionEnd(): number | null {
    return this._field?.selectionEnd ?? null;
  }
  set selectionEnd(selectionEnd: number | null) {
    if (this._field) {
      this._field.selectionEnd = selectionEnd;
    }
  }

  /**
   * The **`valueAsNumber`** property of the HTMLInputElement interface represents the current value of the input element as a number or `NaN` if converting to a numeric value is not possible.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/valueAsNumber)
   */
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

  /**
   * The **`valueAsDate`** property of the HTMLInputElement interface represents the current value of the input element as a Date, or `null` if conversion is not possible.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/valueAsDate)
   */
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

  /**
   * The **`HTMLInputElement.showPicker()`** method displays the browser picker for an `input` element.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/showPicker)
   */
  showPicker(): void {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.showPicker();
  }

  /**
   * The **`HTMLInputElement.stepUp()`** method increments the value of a numeric type of input element by the value of the `step` attribute, or the default `step` value if the step attribute is not explicitly set.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/stepUp)
   */
  stepUp(amount?: number): void {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.stepUp(amount);
  }

  /**
   * The **`HTMLInputElement.stepDown()`** method decrements the value of a numeric type of input element by the value of the `step` attribute or up to `n` multiples of the step attribute if a number is passed as the parameter.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/stepDown)
   */
  stepDown(amount?: number): void {
    const input = this._field;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    input.stepDown(amount);
  }

  /**
   * The **`HTMLInputElement.setSelectionRange()`** method sets the start and end positions of the current text selection in an input or textarea element.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/setSelectionRange)
   */
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

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("value") || changed.has("focusVisible")) {
      this.floating = !!this.value || this.focusVisible;
    }

    if (changed.has("_hasLabel")) {
      this.toggleAttribute("has-label", this._hasLabel);
    }
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("value")) {
      this.setValue(this.value);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#resizeObserver?.disconnect();
  }

  override render(): TemplateResult {
    return html`${this.#renderLabel()}${this.#renderInput()}${this.#renderTextArea()}${this.#renderOutline()}`;
  }

  override resetFormControl = (): void => {
    this.value = this.getAttribute("value") || "";
  };

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

    const maxLength = this.maxLength > -1 ? this.maxLength : undefined;
    const minLength = this.minLength > -1 ? this.minLength : undefined;

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
        maxlength=${ifDefined(maxLength)}
        minlength=${ifDefined(minLength)}
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

    const maxLength = this.maxLength > -1 ? this.maxLength : undefined;
    const minLength = this.minLength > -1 ? this.minLength : undefined;

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
        maxlength=${ifDefined(maxLength)}
        minlength=${ifDefined(minLength)}
        .value=${live(this.value)}
        @focus=${this.#handleFocusChange}
        @blur=${this.#handleFocusChange}
        @input=${this.#handleInput}
      ></textarea>
      <div
        class="resize"
        @pointerdown=${this.#startObserving}
        @pointercancel=${this.#stopObserving}
        @pointerup=${this.#stopObserving}
      ></div>
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

  #startObserving(event: PointerEvent): void {
    if (!event.isPrimary) {
      return;
    }

    this.#initializeResizeHandle();
  }

  #stopObserving(): void {
    this.#resizeObserver?.disconnect();
    if (!this._resize) {
      return;
    }

    this._resize.removeAttribute("style");
  }

  /**
   * This is required since the `textarea` itself cannot be resizable due to
   * having margin applied so the text inside does not clip and the drag handle
   * is misplaced due to that margin. So as the user drags the resize handle,
   * need to sync the size with the entire mwc-text-field.
   *
   * This works pretty well except when there is a grid with a lot of resizable
   * textarea. it will sometimes "lag"/freeze and jump when adjusting to be too
   * small. This is good enough to me for now as that's an edge case.
   */
  #initializeResizeHandle(): void {
    const resize = this._resize;
    if (!resize) {
      return;
    }

    // skip the initial resize observer callback so it is only once the user
    // starts resizing that it updates
    this.#resizeObserver ??= new ResizeObserver((entries) => {
      if (!this.#observedOnce) {
        this.#observedOnce = true;
        return;
      }

      for (const entry of entries) {
        // when the size of the textfield itself has changed, just sync back to
        // the resize handle
        if (entry.target === this) {
          const { width, height } = entry.contentRect;
          resize.style.width = `${width}px`;
          resize.style.height = `${height}px`;
        } else if (entry.target === resize) {
          this.#syncHandleWithTextArea(resize, entry.contentRect);
        }
      }
    });
    this.#resizeObserver.observe(this);
    this.#resizeObserver.observe(resize);
  }

  #syncHandleWithTextArea(
    resize: HTMLDivElement,
    contentRect: DOMRectReadOnly,
  ): void {
    const { width, height } = contentRect;
    this.style.width = `${width}px`;
    this.style.height = `${height}px`;

    // once the new size has been set, need to check if the size was actually
    // applied as-is or constrained to new values. This can happen when:
    // - there is a min/max (optional) height/width applied
    // - resized to an edge of the container
    // - the mwc-text-field is in a flex or grid container that limits the
    //   size
    const { width: nextWidth, height: nextHeight } =
      this.getBoundingClientRect();
    if (nextWidth !== width) {
      if (nextWidth < width) {
        resize.style.maxWidth = `${nextWidth}px`;
      }

      resize.style.width = `${nextWidth}px`;
    }

    if (nextHeight !== height) {
      if (nextHeight < height) {
        resize.style.maxHeight = `${nextHeight}px`;
      }

      resize.style.height = `${nextHeight}px`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-text-field": TextField;
  }
}
