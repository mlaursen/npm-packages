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

export type StylableLitElement = Constructor<LitElement> & {
  styles?: CSSResultGroup;
};

export type MixedStylableLitElement<T extends StylableLitElement> = T & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): LitElement;
  styles: CSSResultArray;
};
