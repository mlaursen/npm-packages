import type { TaggedConstructor } from "../types.js";

/**
 * This is a small type-guard to help determine if an element is one of the
 * custom elements defined since `instanceof` won't work
 *
 * @example Main Example
```ts
if (isCustomElement(event.target, Checkbox)) {
  console.log(event.target.checked)
}

if (isCustomElement(event.target, TextField)) {
  console.log(event.target.value)
}
```
 * @param target - The target to check against
 * @param ctor - the constructor that has a static `elementName` defined that can be read
 */
export function isCustomElement<T extends TaggedConstructor>(
  target: unknown,
  ctor: T,
): target is InstanceType<T> {
  return target instanceof Element && target.matches(ctor.elementName);
}
