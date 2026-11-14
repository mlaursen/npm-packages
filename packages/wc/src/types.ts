import type { CSSResultArray, CSSResultGroup, LitElement } from "lit";

export type DefaultComponentSize = "small" | "medium" | "large";

export type DefaultComponentExtraSize =
  | DefaultComponentSize
  | "extra-small"
  | "extra-large";

export type DefaultComponentShape = "square" | "round";

/**
 * This was added since it is not officially a part of the lib.d.ts file yet in
 * Typescript. Should be removed once it is.
 *
 * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#command)
 */
export type CommandAttribute =
  | "show-modal"
  | "close"
  | "request-close"
  | "show-popover"
  | "hide-popover"
  | "toggle-popover"
  | `--${string}`;

/**
 * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertargetaction)
 */
export type PopoverTargetAction = "show" | "hide" | "toggle";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T;
export type LitConstructor<T = LitElement> = Constructor<T>;
export type LitConstructorWithObservedAttributes = LitConstructor &
  Pick<typeof LitElement, "observedAttributes">;
export type TaggedCustomElementConstructor = CustomElementConstructor & {
  elementName: string;
};

export type StylableLitElement<T = LitElement> = LitConstructor<T> & {
  styles?: CSSResultGroup;
  shadowRootOptions?: ShadowRootInit;
};
export type StyledLitElement<T = LitElement> = LitConstructor<T> & {
  styles: CSSResultArray;
};
export type StyledLitElementWithProperties<P, T = LitElement> = T &
  StyledLitElement<P>;

/**
 * This is used to ensure that `element.addEventListener()` adds the custom
 * event map autocompletion without affecting the global types
 */
export declare class TypedEventTarget<CustomEventMap extends object> {
  addEventListener<K extends keyof CustomEventMap & string>(
    type: K,
    listener: (this: this, ev: CustomEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof CustomEventMap & string>(
    type: K,
    listener: (this: this, ev: CustomEventMap[K]) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
}

export type TypedEventLitConstructor<
  T,
  P extends object,
  CustomEventMap extends object,
> = T & LitConstructor<P & TypedEventTarget<CustomEventMap>>;

export interface Point {
  x: number;
  y: number;
}
