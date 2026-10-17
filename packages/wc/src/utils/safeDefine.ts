import type { TaggedConstructor } from "../types.js";

export function safeDefine(instance: TaggedConstructor): void {
  if (!customElements.get(instance.elementName)) {
    customElements.define(instance.elementName, instance);
  }
}
