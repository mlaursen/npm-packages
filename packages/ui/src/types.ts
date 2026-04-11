import { type Constructor } from "@open-wc/form-control";
import { type CSSResultArray, type CSSResultGroup, type LitElement } from "lit";

export type OverridableStringUnion<
  Defaults extends string,
  Overrides extends Partial<Record<string, boolean>>,
> =
  | Exclude<Defaults, { [K in keyof Overrides]: K }[keyof Overrides]>
  | {
      [K in keyof Overrides]: Overrides[K] extends false ? never : K;
    }[keyof Overrides];

export type LiteralStringUnion<T extends U, U = string> = T | (U & {});

export type DefaultComponentSize = "small" | "medium" | "large";

export type DefaultComponentExtraSize =
  | DefaultComponentSize
  | "extra-small"
  | "extra-large";

export type LitConstructor<T = LitElement> = Constructor<T>;
export type StylableLitElement<T = LitElement> = LitConstructor<T> & {
  styles?: CSSResultGroup;
};
export type StyledLitElement<T = LitElement> = LitConstructor<T> & {
  styles: CSSResultArray;
};
export type StyledLitElementWithProperties<P, T = LitElement> = T &
  StyledLitElement<P>;
