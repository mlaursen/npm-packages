import type { LitElement } from "lit";

import type { AriaMixinProperties } from "../aria-mixin/types.js";
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

export interface FormControlStaticProperties {
  formControlValidators: Validator[];
}

export interface FormControlStates {
  error: boolean;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
}

export interface FormControlProperties extends FormControlStates {
  value: string;
  setValue(value: FormValue): void;

  updateInternals(): void;
  resetFormControl: () => void;
  validationTarget: HTMLElement | null;

  isErrored(): boolean;
}

export type LitConstructorWithElementInternals = LitConstructor<
  LitElement & AriaMixinProperties
>;
export type LitElementWithFormControlProperties<
  T extends LitConstructorWithElementInternals,
> = T & LitConstructor<FormControlProperties> & FormControlStaticProperties;
