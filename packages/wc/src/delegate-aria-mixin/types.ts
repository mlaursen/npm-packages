import type { LitElement } from "lit";

import type { LitConstructor } from "../types.js";

export declare class DelegateAriaMixinProperties {
  protected get delegateAriaTarget(): HTMLElement | null;
}

export type LitElementWithDelegateAriaProperties<T = LitElement> = T &
  LitConstructor<DelegateAriaMixinProperties>;
