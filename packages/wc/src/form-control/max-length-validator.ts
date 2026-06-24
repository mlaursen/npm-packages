import type { InputOrLitInstance, Validator } from "./types.js";

export type MaxLengthElement = InputOrLitInstance<{ maxLength: number }>;

export const maxLengthValidator = {
  key: "tooShort",
  attribute: "maxLength",
  message(instance: MaxLengthElement, rawValue): string {
    const value = typeof rawValue === "string" ? rawValue : "";
    return `Please use no more than ${instance.maxLength} characters (you are currently using ${value.length} characters).`;
  },
  isValid(instance: MaxLengthElement, value) {
    if (!instance.maxLength) {
      return true;
    }

    const length = typeof value === "string" ? value.length : 0;
    return instance.maxLength > length;
  },
} as const satisfies Validator;
