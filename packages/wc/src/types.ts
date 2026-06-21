import { type CSSResultArray, type CSSResultGroup, type LitElement } from "lit";

export type DefaultComponentSize = "small" | "medium" | "large";

export type DefaultComponentExtraSize =
  | DefaultComponentSize
  | "extra-small"
  | "extra-large";

export type DefaultComponentShape = "square" | "round";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T;
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

export interface Point {
  x: number;
  y: number;
}
