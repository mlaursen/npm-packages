import { describe, expect, it } from "vitest";

import { getVar, getVarName, lightDark } from "../tokens.js";

describe("lightDark", () => {
  it("should just create a simple light-dark statement", () => {
    expect(lightDark("red", "blue")).toBe("light-dark(red, blue)");
    expect(lightDark("blue", "red")).toBe("light-dark(blue, red)");
  });

  it("should support any values", () => {
    expect(
      lightDark(
        getVar("palette.light-primary"),
        getVar("palette.dark-primary"),
      ),
    ).toBe("light-dark(var(--mwc-light-primary), var(--mwc-dark-primary))");
  });
});

describe("getVarName", () => {
  it("should prefix names with --mwc-", () => {
    expect(getVarName("size")).toBe("--mwc-size");
  });

  it("should support hyphenated names", () => {
    expect(getVarName("some-property")).toBe("--mwc-some-property");
    expect(getVarName("another-property-with-more-stuff")).toBe(
      "--mwc-another-property-with-more-stuff",
    );
  });

  it("should replace dots with hyphens", () => {
    expect(getVarName("divider.size")).toBe("--mwc-divider-size");
    expect(getVarName("text-field.floating.label.width")).toBe(
      "--mwc-text-field-floating-label-width",
    );
  });

  it("should remove the palette prefix to match the Sass variable names", () => {
    expect(getVarName("palette.primary")).toBe("--mwc-primary");
    expect(getVarName("palette.primary-container")).toBe(
      "--mwc-primary-container",
    );
  });

  it("should remove the transition prefix to match the Sass variable names", () => {
    expect(getVarName("transition.duration.medium-2")).toBe(
      "--mwc-duration-medium-2",
    );
  });
});

describe("getVar", () => {
  it("should return a var statement", () => {
    expect(getVar("size")).toBe("var(--mwc-size)");
  });

  it("should support a fallback value string", () => {
    expect(getVar("size", "3rem")).toBe("var(--mwc-size, 3rem)");
  });

  it("should support a fallback value number", () => {
    expect(getVar("size", 3)).toBe("var(--mwc-size, 3)");
  });

  it("should automatically convert dotted tokens", () => {
    expect(getVar("palette.primary")).toBe("var(--mwc-primary)");
    expect(getVar("palette.primary", getVar("palette.light-primary"))).toBe(
      "var(--mwc-primary, var(--mwc-light-primary))",
    );
  });
});
