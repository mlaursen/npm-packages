import type { LitConstructor } from "../types.js";

export function safeDefine(name: string, instance: LitConstructor): void {
  if (!customElements.get(name)) {
    customElements.define(name, instance);
  }
}
