import type { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import type {
  CustomValidityState,
  FormControlProperties,
  FormValue,
  LitConstructorWithElementInternals,
  LitElementWithFormControlProperties,
  Validator,
} from "./types.js";

const SHOW_ERROR_VAR = "--show-error";

export interface FormControlElementOptions {
  /** @defaultValue `true` */
  reflectAriaInvalid?: boolean;

  /** @defaultValue `[]` */
  updateInternalsAttributes?: readonly string[];
}

export function FormControlMixin<T extends LitConstructorWithElementInternals>(
  Base: T,
  options: FormControlElementOptions = {},
): LitElementWithFormControlProperties<T> {
  const { reflectAriaInvalid = true, updateInternalsAttributes = [] } = options;

  class FormControlElement extends Base implements FormControlProperties {
    static formControlValidators: Validator[] = [];

    @property({ type: Boolean })
    error = false;

    @property({ type: Boolean })
    disabled = false;

    @property({ type: Boolean })
    required = false;

    @property({ type: Boolean })
    readOnly = false;

    @property()
    value = "";

    #value: FormValue = null;
    #touched = false;
    #focused = false;
    #forceError = false;
    #abortController?: AbortController;

    override connectedCallback(): void {
      super.connectedCallback();

      this.updateInternals();

      this.addEventListener("focus", this.#handleFocus);
      this.addEventListener("blur", this.#handleBlur);
      this.addEventListener("invalid", this.#handleInvalid);
      this.form?.addEventListener("reset", this.#handleReset);
    }

    protected override willUpdate(changed: PropertyValues): void {
      super.willUpdate(changed);

      if (updateInternalsAttributes.some((attr) => changed.has(attr))) {
        this.updateInternals();
      }
    }

    protected override updated(changed: PropertyValues): void {
      super.updated(changed);

      const validators = this.#getValidators();
      const attributes = new Set<string>();
      for (const { attribute } of validators) {
        if (typeof attribute === "string") {
          attributes.add(attribute);
        } else if (attribute) {
          for (const attr of attribute) {
            attributes.add(attr);
          }
        }
      }

      if (
        [...attributes].some(
          (attr) => changed.has(attr) && changed.get(attr) !== undefined,
        )
      ) {
        this.#validate(this.#value);
      }
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.form?.removeEventListener("reset", this.#handleReset);
    }

    resetFormControl = (): void => {};
    updateInternals(): void {}

    get validationTarget(): HTMLElement | null {
      return null;
    }

    isErrored(): boolean {
      return this.error || this.internals.states.has(SHOW_ERROR_VAR);
    }

    checkValidity(): boolean {
      return this.internals.checkValidity();
    }

    get validity(): ValidityState {
      return this.internals.validity;
    }

    get validationMessage(): string {
      return this.internals.validationMessage;
    }

    setValue(value: FormValue, state?: FormValue): void {
      this.#forceError = false;
      this.#value = value;
      this.internals.setFormValue(value, state);
      this.#validate(value);
      this.#setErrorState(this.#shouldShowError());
    }

    #getValidators(): readonly Validator[] {
      const proto = this.constructor as typeof FormControlElement;
      return proto.formControlValidators ?? [];
    }

    async #validate(value: FormValue): Promise<void> {
      const validators = this.#getValidators();

      this.#abortController?.abort();
      const controller = new AbortController();
      this.#abortController = controller;
      if (validators.length === 0) {
        return;
      }

      let changed = false;
      let validationMessage: string | undefined;
      const validity: CustomValidityState = {};
      const promises: Promise<void>[] = [];
      for (const validator of validators) {
        const key = validator.key ?? "customError";
        const valid = validator.isValid(this, value, controller.signal);
        if (typeof valid === "boolean") {
          validity[key] = !valid;
          changed ||= this.validity[key] !== validity[key];
          if (!valid && !validationMessage) {
            validationMessage = this.#getValidationMessage(validator, value);
          }

          continue;
        }

        promises.push(
          valid.then((valid) => {
            if (typeof valid !== "boolean") {
              return;
            }

            validity[key] = !valid;
          }),
        );
      }

      const isAsync = promises.length > 0;

      if (changed || !isAsync) {
        this.#setValidity(validity, validationMessage);
      }

      if (isAsync) {
        await Promise.allSettled(promises);
        if (!controller.signal.aborted) {
          // oxlint-disable-next-line no-console
          console.log("done validating");
        }
      }
    }

    #getValidationMessage(validator: Validator, value: FormValue): string {
      if (typeof validator.message === "string") {
        return validator.message;
      }

      return validator.message(this, value);
    }

    #handleFocus = (): void => {
      this.#touched = true;
      this.#focused = true;
    };

    #handleBlur = (): void => {
      this.#focused = false;
    };

    #handleInvalid = (): void => {
      this.#touched = true;
      this.#forceError = true;
      this.#setErrorState(this.#shouldShowError());
    };

    #handleReset = (): void => {
      this.#focused = false;
      this.#touched = false;
      this.#forceError = false;
      this.#setErrorState(this.#shouldShowError());

      this.resetFormControl();
    };

    #shouldShowError(): boolean {
      if (this.disabled) {
        return false;
      }

      return (
        this.#forceError ||
        (this.#touched && !this.validity.valid && !this.#focused)
      );
    }

    #setErrorState(error: boolean): void {
      if (error) {
        this.internals.states.add(SHOW_ERROR_VAR);
        if (reflectAriaInvalid) {
          this.setAttribute("aria-invalid", "true");
        }
      } else {
        this.internals.states.delete(SHOW_ERROR_VAR);
        if (reflectAriaInvalid) {
          this.removeAttribute("aria-invalid");
        }
      }
    }

    #setValidity(
      validity: Partial<ValidityState>,
      validationMessage: string | undefined,
    ): void {
      // might need the awaiting validation target here
      this.internals.setValidity(
        validity,
        validationMessage,
        this.validationTarget ?? undefined,
      );
    }
  }

  return FormControlElement;
}
