import { afterEach, describe, expect, it, vi } from "vitest";

import { calcRtlTranslate, toggleRtl } from "../rtl.js";

function createFakeElement(): HTMLElement {
  return {
    dir: "ltr",
    style: {
      setProperty: vi.fn(),
      removeProperty: vi.fn(),
    },
  } as unknown as HTMLElement;
}

describe("toggleRtl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should do nothing if there is no element", () => {
    expect(globalThis.document).toBeUndefined();
    expect(() => toggleRtl()).not.toThrow();
  });

  it("should set to the provided element", () => {
    const element = createFakeElement();
    expect(element.dir).toBe("ltr");

    toggleRtl({ element, dir: "rtl" });
    expect(element.dir).toBe("rtl");

    toggleRtl({ element, dir: "ltr" });
    expect(element.dir).toBe("ltr");
  });

  it("should default to the document.documentElement", () => {
    const fakeDocument = {
      documentElement: createFakeElement(),
    } as Document;
    vi.stubGlobal("document", fakeDocument);

    toggleRtl({ dir: "rtl" });
    expect(fakeDocument.documentElement.dir).toBe("rtl");
  });

  it("should be able to toggle it by checking the dir attribute", () => {
    const element = createFakeElement();
    expect(element.dir).toBe("ltr");

    toggleRtl({ element });
    expect(element.dir).toBe("rtl");

    toggleRtl({ element });
    expect(element.dir).toBe("ltr");
  });

  it("should set the custom --mwc-rtl-mult var when in RTL mode to handle reversing animations and positions", () => {
    const element = createFakeElement();

    toggleRtl({ element });
    expect(element.style.setProperty).toHaveBeenCalledWith(
      "--mwc-rtl-mult",
      "-1",
    );

    toggleRtl({ element });
    expect(element.style.removeProperty).toHaveBeenCalledWith("--mwc-rtl-mult");
  });
});

describe("calcRtlTranslate", () => {
  it("should just multiply the provided value with the --mwc-rtl-mult var", () => {
    expect(calcRtlTranslate("3rem")).toBe(
      "calc(3rem * var(--mwc-rtl-mult, 1))",
    );

    expect(calcRtlTranslate("var(--custom)")).toBe(
      "calc(var(--custom) * var(--mwc-rtl-mult, 1))",
    );

    expect(calcRtlTranslate("calc(3rem - var(--custom))")).toBe(
      "calc(calc(3rem - var(--custom)) * var(--mwc-rtl-mult, 1))",
    );
  });
});
