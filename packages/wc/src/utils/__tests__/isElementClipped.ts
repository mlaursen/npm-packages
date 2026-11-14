// @vitest-environment happy-dom
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";

import { isElementClipped } from "../isElementClipped.js";

const overflowX = vi.fn(() => "visible");
const overflowY = vi.fn(() => "visible");
let getComputedStyleSpy: Mock<typeof globalThis.getComputedStyle>;

beforeEach(() => {
  getComputedStyleSpy = vi
    .spyOn(globalThis, "getComputedStyle")
    .mockImplementation(
      () =>
        ({
          get overflowX() {
            return overflowX();
          },
          get overflowY() {
            return overflowY();
          },
        }) as CSSStyleDeclaration,
    );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isElementClipped", () => {
  it("should return false if the element is not a HTMLElement", () => {
    expect(isElementClipped(document.createTextNode("Example"))).toBe(false);
    expect(isElementClipped(document.createComment("comment"))).toBe(false);
    expect(isElementClipped(document.createDocumentFragment())).toBe(false);
  });

  it("should not compute style for non-HTMLElements", () => {
    isElementClipped(document.createTextNode("Example"));
    expect(getComputedStyleSpy).not.toHaveBeenCalled();
  });

  it("should return false if both overflowX and overflowY are visible", () => {
    const div = document.createElement("div");
    expect(isElementClipped(div)).toBe(false);
    expect(getComputedStyleSpy).toHaveBeenCalledExactlyOnceWith(div);
    expect(overflowX).toHaveBeenCalledOnce();
    expect(overflowY).toHaveBeenCalledOnce();
  });

  it("should return true if the scrollWidth is greater than the clientWidth", () => {
    const div = document.createElement("div");
    overflowX.mockReturnValue("hidden");
    const scrollWidth = vi
      .spyOn(div, "scrollWidth", "get")
      .mockReturnValueOnce(200)
      .mockReturnValueOnce(250);
    vi.spyOn(div, "clientWidth", "get").mockReturnValue(200);
    vi.spyOn(div, "scrollHeight", "get").mockReturnValue(24);
    vi.spyOn(div, "clientHeight", "get").mockReturnValue(24);

    expect(isElementClipped(div)).toBe(false);
    expect(isElementClipped(div)).toBe(true);
    expect(scrollWidth).toHaveBeenCalledTimes(2);
  });

  it("should return true if the scrollHeight is greater than the clientHeight", () => {
    const div = document.createElement("div");
    overflowY.mockReturnValue("hidden");
    const scrollHeight = vi
      .spyOn(div, "scrollHeight", "get")
      .mockReturnValueOnce(200)
      .mockReturnValueOnce(250);
    vi.spyOn(div, "clientHeight", "get").mockReturnValue(200);
    vi.spyOn(div, "scrollWidth", "get").mockReturnValue(24);
    vi.spyOn(div, "clientWidth", "get").mockReturnValue(24);

    expect(isElementClipped(div)).toBe(false);
    expect(isElementClipped(div)).toBe(true);
    expect(scrollHeight).toHaveBeenCalledTimes(2);
  });
});
