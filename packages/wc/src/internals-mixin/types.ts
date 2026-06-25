import type { LitElement } from "lit";

import type { LitConstructor } from "../types.js";

export interface ElementWithInternalsProperties {
  internals: ElementInternals;
  readonly form: HTMLFormElement | null;
}

export type LitElementWithInternals<T = LitElement> = T &
  LitConstructor<ElementWithInternalsProperties>;
