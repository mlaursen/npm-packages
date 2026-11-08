// @vitest-environment happy-dom
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { NamedMediaQueries } from "../types.js";
import {
  createMediaQuery,
  getDefaultNamedMediaQueries,
  isNamedMediaQuery,
} from "../utils.js";

const defaults = getDefaultNamedMediaQueries();

beforeAll(() => {
  if (globalThis.MediaQueryList === undefined) {
    globalThis.MediaQueryList = class MediaQueryListMock
      extends EventTarget
      implements MediaQueryList
    {
      matches: boolean = false;
      media: string = "";
      onchange = null;
      addListener = vi.fn();
      removeListener = vi.fn();
    };
  }
});

describe("getDefaultNamedMediaQueries", () => {
  it("should return the expected default named queries", () => {
    expect(getDefaultNamedMediaQueries()).toEqual({
      phone: "screen and (max-width: 47.9375em)",
      tablet: "screen and (min-width: 48em)",
      "tablet-only": "screen and (min-width: 48em) and (max-width: 64em)",
      desktop: "screen and (min-width: 64.0625em)",
      "large-desktop": "screen and (min-width: 80em)",
    } satisfies NamedMediaQueries);
  });
});

describe("isNamedMediaQuery", () => {
  it("should return true if the query exists in the provided queries", () => {
    expect(isNamedMediaQuery("phone", defaults)).toBe(true);
    expect(isNamedMediaQuery("invalid", defaults)).toBe(false);
  });
});

describe("createMediaQuery", () => {
  const matchMedia = vi.spyOn(globalThis, "matchMedia");
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return null if there is no query", () => {
    expect(createMediaQuery(null)).toBe(null);
  });

  it("should create a media query with a named query", () => {
    expect(createMediaQuery("phone")).not.toBeNull();
    expect(matchMedia).toHaveBeenCalledWith(defaults.phone);
  });
});
