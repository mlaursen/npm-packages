import type { LitElement } from "lit";

import type { ElementWithInternalsProperties } from "../internals-mixin/types.js";
import type { LitConstructor } from "../types.js";

export type FormValue = Parameters<ElementInternals["setFormValue"]>[0];

export type InputOrLitInstance<P extends object = object> =
  | HTMLInputElement
  | HTMLTextAreaElement
  | (LitElement & P);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorInstance = any;
export interface Validator {
  key?: keyof ValidityState;

  attribute?: string | readonly string[];

  message: string | ((instance: ValidatorInstance, value: FormValue) => string);

  isValid: (
    instance: ValidatorInstance,
    value: FormValue,
    signal: AbortSignal,
  ) => boolean | Promise<boolean>;
}

export interface CustomValidityState extends ValidityStateFlags {
  valid?: boolean;
}

export interface FormValidationStaticProperties {
  formValidators: Validator[];
}

export interface FormValidationStates {
  error: boolean;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
}

export interface FormValidationProperties extends FormValidationStates {
  value: string;
  setValue(value: FormValue): void;

  updateInternals(): void;
  _onFormReset: () => void;
  validationTarget: HTMLElement | null;

  isErrored(): boolean;

  checkValidity(): boolean;
  validity: ValidityState;
  validationMessage: string;
}

export type LitConstructorWithElementInternals = LitConstructor<
  LitElement & ElementWithInternalsProperties
>;
export type LitElementWithFormValidationProperties<
  T extends LitConstructorWithElementInternals,
> = T &
  LitConstructor<FormValidationProperties> &
  FormValidationStaticProperties;

export interface FormValidationMixinOptions {
  /** @defaultValue `true` */
  reflectAriaInvalid?: boolean;

  /** @defaultValue `[]` */
  updateInternalsAttributes?: readonly string[];
}
