import type { TaggedCustomElementConstructor } from "../types.js";

export function safeDefine(instance: TaggedCustomElementConstructor): void {
  if (!customElements.get(instance.elementName)) {
    customElements.define(instance.elementName, instance);
  }
}
