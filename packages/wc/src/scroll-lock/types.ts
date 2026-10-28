import type { LitElement } from "lit";

import type { LitConstructor } from "../types.js";

export interface ScrollLockProperties {
  _scrollLock(lock: boolean): void;
}

export type LitElementWithScrollLockProperties<T = LitElement> = T &
  LitConstructor<ScrollLockProperties>;
