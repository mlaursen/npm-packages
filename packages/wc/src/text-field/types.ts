import type { OverridableStringUnion } from "@mlaursen/utils";

export interface TextFieldSizeOverrides {}
export type DefaultTextFieldSize = "small" | "normal";
export type TextFieldSize = OverridableStringUnion<
  DefaultTextFieldSize,
  TextFieldSizeOverrides
>;

export interface TextFieldShapeOverrides {}
export type DefaultTextFieldShape = "square";
export type TextFieldShape = OverridableStringUnion<
  DefaultTextFieldShape,
  TextFieldShapeOverrides
>;

export interface TextFieldVariantOverrides {}
export type DefaultTextFieldVariant = "filled" | "outlined";
export type TextFieldVariant = OverridableStringUnion<
  DefaultTextFieldVariant,
  TextFieldVariantOverrides
>;

export type ForwardedInputProperties = Pick<
  HTMLInputElement,
  | "value"
  | "autocomplete"
  | "autocorrect"
  | "min"
  | "max"
  | "name"
  | "pattern"
  | "placeholder"
  | "readOnly"
  | "disabled"
  | "required"
  | "multiple"
  // these are more getters and setters
  | "selectionStart"
  | "selectionEnd"
>;

export type OverriddenInputMethods = Pick<
  HTMLInputElement,
  | "focus"
  | "showPicker"
  | "stepUp"
  | "stepDown"
  | "setSelectionRange"
  | "setRangeText"
  | "select"
>;

export type SupportedInputType =
  | "email"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "textarea"
  | "url";

export type UnsupportedInputType =
  | "color"
  | "date"
  | "datetime-local"
  | "month"
  | "file"
  | "time"
  | "week";

export type AutoCapitalize =
  | ""
  | "on"
  | "off"
  | "words"
  | "sentences"
  | "characters"
  | "none";

export interface TextFieldProperties
  extends ForwardedInputProperties, OverriddenInputMethods {
  /**
   * @defaultValue `"text"`
   */
  type: SupportedInputType | UnsupportedInputType;
  error: boolean;
  step?: number;
  minLength?: number;
  maxLength?: number;

  autocapitalize: AutoCapitalize;

  /**
   * @defaultValue `"normal"`
   */
  size: TextFieldSize;

  /**
   * @defaultValue `"square"`
   */
  shape: TextFieldShape;
}
