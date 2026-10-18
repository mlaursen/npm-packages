/** @vitest-environment happy-dom */
import { describe, expect, it } from "vitest";

import { isCustomElement } from "../isCustomElement.js";

class Example extends HTMLElement {
  static readonly elementName = "mwc-example";
}

describe("isCustomElement", () => {
  it("should return false if the target is not an element", () => {
    expect(isCustomElement(null, Example)).toBe(false);
    expect(isCustomElement(false, Example)).toBe(false);
    expect(isCustomElement(true, Example)).toBe(false);
    expect(isCustomElement(undefined, Example)).toBe(false);
  });

  it("should return true if it matches the elementName", () => {
    const target = document.createElement(Example.elementName);
    expect(isCustomElement(target, Example)).toBe(true);
  });
});
