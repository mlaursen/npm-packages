// oxfmt forces them to be lowercase
// oxlint-disable unicorn/number-literal-case
import { describe, expect, it } from "vitest";

import {
  contrastColor,
  getContrastRatio,
  getLuminance,
  getRGB,
  hexToRGB,
} from "../luminance.js";

const INVALID = new TypeError("Invalid color string.");

describe("hexToRGB", () => {
  it.each([
    ["#000000", { r: 0, g: 0, b: 0 }],
    ["#000", { r: 0, g: 0, b: 0 }],
    ["#ffffff", { r: 255, g: 255, b: 255 }],
    ["#fff", { r: 255, g: 255, b: 255 }],
    ["#FFFfff", { r: 255, g: 255, b: 255 }],
    ["#ffF", { r: 255, g: 255, b: 255 }],
    ["#123", { r: 0x11, g: 0x22, b: 0x33 }],
    ["#abc", { r: 0xaa, g: 0xbb, b: 0xcc }],
    ["#ff0000", { r: 255, g: 0, b: 0 }],
    ["#00ff00", { r: 0, g: 255, b: 0 }],
    ["#0000ff", { r: 0, g: 0, b: 255 }],
  ])("should convert %s", (hex, expected) => {
    expect(hexToRGB(hex)).toEqual(expected);
  });

  it.each([
    ["000000", { r: 0, g: 0, b: 0 }],
    ["000", { r: 0, g: 0, b: 0 }],
    ["ffffff", { r: 255, g: 255, b: 255 }],
    ["fff", { r: 255, g: 255, b: 255 }],
    ["FFFfff", { r: 255, g: 255, b: 255 }],
    ["ffF", { r: 255, g: 255, b: 255 }],
  ])("should convert %s without a leading '#'", (hex, expected) => {
    expect(hexToRGB(hex)).toEqual(expected);
  });

  it.each(["", "#", "#fafa", "fffa", "#ggg", "#fffffff", "##fff"])(
    "should throw for %j",
    (hex) => {
      expect(() => hexToRGB(hex)).toThrow(INVALID);
    },
  );
});

describe("getRGB", () => {
  it.each([
    ["#ff8000", { r: 255, g: 128, b: 0 }],
    ["ff8000", { r: 255, g: 128, b: 0 }],
    ["#f80", { r: 255, g: 136, b: 0 }],
  ])("should parse hex string %s", (color, expected) => {
    expect(getRGB(color)).toEqual(expected);
  });

  it.each([
    ["rgb(255,0,0)", { r: 255, g: 0, b: 0 }],
    ["rgb(0,255,0)", { r: 0, g: 255, b: 0 }],
    ["rgb(0,0,255)", { r: 0, g: 0, b: 255 }],
    ["rgb(10,20,30)", { r: 10, g: 20, b: 30 }],
    ["rgb(0,0,0)", { r: 0, g: 0, b: 0 }],
    ["rgb(255,255,255)", { r: 255, g: 255, b: 255 }],
    ["rgb(1, 2, 3)", { r: 1, g: 2, b: 3 }],
    ["  rgb( 1 , 2 , 3 )  ", { r: 1, g: 2, b: 3 }],
  ])("should parse rgb string %j", (color, expected) => {
    expect(getRGB(color)).toEqual(expected);
  });

  it.each(["", "red", "#ggg", "rgb(256,0,0)", "rgb(0,0)", "rgba(0,0,0,1)"])(
    "should throw for %j",
    (color) => {
      expect(() => getRGB(color)).toThrow(INVALID);
    },
  );
});

describe("getLuminance", () => {
  it.each([
    ["#000", 0],
    ["#fff", 1],
  ])("should return exactly %s -> %d", (color, expected) => {
    expect(getLuminance(color)).toBe(expected);
  });

  it.each([
    ["#ff0000", 0.2126],
    ["#00ff00", 0.7152],
    ["#0000ff", 0.0722],
  ])("should weight %s by its WCAG 2.0 coefficient", (color, expected) => {
    expect(getLuminance(color)).toBeCloseTo(expected, 4);
  });

  it.each([
    ["#808080", 0.2159],
    ["#767676", 0.1812],
  ])("should match the known mid-tone value for %s", (color, expected) => {
    expect(getLuminance(color)).toBeCloseTo(expected, 4);
  });

  it("should use the linear branch for very dark channels", () => {
    // 10 / 255 is below the 0.03928 threshold, so it is divided by 12.92
    expect(getLuminance("#0a0a0a")).toBeCloseTo(10 / 255 / 12.92, 6);
    expect(getLuminance("#0b0b0b")).toBeGreaterThan(getLuminance("#0a0a0a"));
  });

  it.each([
    ["rgb(255,128,0)", "#ff8000"],
    ["rgb(255, 255, 255)", "#fff"],
    ["rgb(0,0,0)", "#000"],
  ])("should treat %s the same as %s", (rgb, hex) => {
    expect(getLuminance(rgb)).toBeCloseTo(getLuminance(hex), 10);
  });

  it("should throw for invalid colors", () => {
    expect(() => getLuminance("nope")).toThrow(TypeError);
  });
});

describe("getContrastRatio", () => {
  it.each([
    ["#000", "#fff", 21],
    ["#fff", "#000", 21],
    ["#fff", "#fff", 1],
    ["#123456", "#123456", 1],
    ["rgb(255,255,255)", "#000", 21],
  ])("should return %d for (%s, %s)", (background, foreground, expected) => {
    expect(getContrastRatio(background, foreground)).toBeCloseTo(expected, 5);
  });

  it.each([
    ["#fff", "#000"],
    ["#336699", "#ffcc00"],
  ])("should be symmetric for %s and %s", (a, b) => {
    expect(getContrastRatio(a, b)).toBeCloseTo(getContrastRatio(b, a), 10);
  });

  it("should match the known WCAG AA boundary for gray on white", () => {
    expect(getContrastRatio("#fff", "#767676")).toBeCloseTo(4.54, 2);
    expect(getContrastRatio("#fff", "#777")).toBeLessThan(4.5);
  });
});

describe("contrastColor", () => {
  it.each([
    ["#fff", "#000"],
    ["#000", "#fff"],
    ["#0000ff", "#fff"],
    ["#ffff00", "#000"],
    ["#767676", "#000"],
    ["#595959", "#fff"],
    ["rgb(0,0,0)", "#fff"],
    ["rgb(255,255,255)", "#000"],
  ])("should pick the higher contrast default for %s -> %s", (bg, expected) => {
    expect(contrastColor(bg)).toBe(expected);
  });

  it.each([
    ["#000", "#eee"],
    ["#fff", "#111"],
  ])(
    "should return the custom light/dark color for %s -> %s",
    (bg, expected) => {
      expect(contrastColor(bg, "#eee", "#111")).toBe(expected);
    },
  );

  it("should return the dark color when both options have equal contrast", () => {
    expect(contrastColor("#777", "#888", "#888888")).toBe("#888888");
  });
});
