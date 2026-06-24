import type { InputOrLitInstance, Validator } from "./types.js";

export type MinLengthElement = InputOrLitInstance<{ minLength: number }>;

export const minLengthValidator = {
  key: "tooShort",
  attribute: "minLength",
  message(instance: MinLengthElement, rawValue): string {
    const value = typeof rawValue === "string" ? rawValue : "";
    return `Please use at least ${instance.minLength} characters (you are currently using ${value.length} characters).`;
  },
  isValid(instance: MinLengthElement, value) {
    if (!value) {
      return true;
    }

    const length = typeof value === "string" ? value.length : 0;
    return instance.minLength < length;
  },
} as const satisfies Validator;
