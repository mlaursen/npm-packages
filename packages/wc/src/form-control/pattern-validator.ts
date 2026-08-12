import type { LitElement } from "lit";

import type { Validator } from "./types.js";

export type PatternElement =
  | HTMLInputElement
  | (LitElement & { pattern: string });

export const patternValidator = {
  key: "patternMismatch",
  attribute: "pattern",
  message: "Please match the requested format",
  isValid(instance: PatternElement, rawValue) {
    const value = typeof rawValue === "string" ? rawValue : "";
    if (!instance.pattern || !value) {
      return true;
    }

    const regexp = new RegExp(instance.pattern);
    return regexp.test(value);
  },
} as const satisfies Validator;
