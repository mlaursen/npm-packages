import { type Constructor } from "@open-wc/form-control";
import { type CSSResultArray, type CSSResultGroup, type LitElement } from "lit";

export type DefaultComponentSize = "small" | "medium" | "large";

export type DefaultComponentExtraSize =
  | DefaultComponentSize
  | "extra-small"
  | "extra-large";

export type LitConstructor<T = LitElement> = Constructor<T>;
export type StylableLitElement<T = LitElement> = LitConstructor<T> & {
  styles?: CSSResultGroup;
  shadowRootOptions?: ShadowRootInit;
};
export type StyledLitElement<T = LitElement> = LitConstructor<T> & {
  styles: CSSResultArray;
};
export type StyledLitElementWithProperties<P, T = LitElement> = T &
  StyledLitElement<P>;
