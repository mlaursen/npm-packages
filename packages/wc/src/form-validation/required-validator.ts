import type { InputOrLitInstance, Validator } from "./types.js";

export type RequiredElement = InputOrLitInstance<{ required: boolean }>;

export const requiredValidator = {
  key: "valueMissing",
  attribute: "required",
  message: "Please fill out this field",
  isValid(instance: RequiredElement, value) {
    return (
      (!instance.hasAttribute("required") && !instance.required) || !!value
    );
  },
} as const satisfies Validator;
