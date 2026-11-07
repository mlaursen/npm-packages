// @vitest-environment happy-dom

import type { ReactiveControllerHost } from "lit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import z, { ZodError } from "zod";

import { URLSearchParamsController } from "../url-search-params-controller.js";

function createHost(): ReactiveControllerHost {
  return {
    addController: vi.fn(),
    removeController: vi.fn(),
    requestUpdate: vi.fn(),
    updateComplete: Promise.resolve(true),
  };
}

function setUrl(url: string) {
  globalThis.history.replaceState(null, "", url);
}

beforeEach(() => {
  setUrl("/");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("URLSearchParamsController", () => {
  it("should register itself with the host and request updates when the popstate event is fired", () => {
    const host = createHost();

    const instance = new URLSearchParamsController(host);

    expect(host.addController).toHaveBeenCalledExactlyOnceWith(instance);
    expect(host.removeController).not.toHaveBeenCalled();
    expect(host.requestUpdate).not.toHaveBeenCalled();

    globalThis.dispatchEvent(new PopStateEvent("popstate"));
    expect(host.requestUpdate).not.toHaveBeenCalledOnce();
  });

  it("should not request an update before connecting", () => {
    const host = createHost();
    new URLSearchParamsController(host);

    globalThis.dispatchEvent(new PopStateEvent("popstate"));

    expect(host.requestUpdate).not.toHaveBeenCalled();
  });

  it("should stop listening after disconnecting", () => {
    const host = createHost();
    const controller = new URLSearchParamsController(host);

    controller.hostConnected();
    controller.hostDisconnected();
    globalThis.dispatchEvent(new PopStateEvent("popstate"));

    expect(host.requestUpdate).not.toHaveBeenCalled();
  });

  it("should not add duplicate listeners when reconnected", () => {
    const host = createHost();
    const controller = new URLSearchParamsController(host);

    controller.hostConnected();
    controller.hostDisconnected();
    controller.hostConnected();
    globalThis.dispatchEvent(new PopStateEvent("popstate"));

    expect(host.requestUpdate).toHaveBeenCalledTimes(1);
    controller.hostDisconnected();
  });

  describe("schemaless", () => {
    it("should return the raw string for a key", () => {
      setUrl("?q=hello&world=2&valueless");

      const controller = new URLSearchParamsController(createHost());

      expect(controller.get("q")).toBe("hello");
      expect(controller.get("world")).toBe("2");
      expect(controller.get("valueless")).toBe("");
    });

    it("should return null if the key doesn't exist", () => {
      const controller = new URLSearchParamsController(createHost());
      expect(controller.get("q")).toBe(null);
    });

    it("should decode encoded values", () => {
      const raw = "hello, world! and more";
      setUrl(`?q=${encodeURIComponent(raw)}`);

      const controller = new URLSearchParamsController(createHost());
      expect(controller.get("q")).toBe(raw);
    });

    it("should return the first value for repeated keys mimicking the default URLSearchParams.get", () => {
      setUrl("?tag=a&tag=b");

      const controller = new URLSearchParamsController(createHost());
      expect(controller.get("tag")).toBe("a");
    });

    it("should be able to get repeated values using the native searchParams", () => {
      setUrl("?tag=a&tag=b");

      const controller = new URLSearchParamsController(createHost());
      expect(controller.searchParams.getAll("tag")).toEqual(["a", "b"]);
    });
  });

  describe("with schema", () => {
    const schema = z.object({
      page: z.coerce.number().int().min(1).catch(1),
      q: z.string().optional().catch(undefined),
      tags: z.array(z.string()).catch([]),
    });

    it("should return parsed and coerced values", () => {
      setUrl("/?page=3&q=hello");
      const controller = new URLSearchParamsController(createHost(), {
        schema,
      });

      expect(controller.get("page")).toBe(3);
      expect(controller.get("q")).toBe("hello");
    });

    it("should use the catch value for invalid input", () => {
      setUrl("/?page=abc");
      const controller = new URLSearchParamsController(createHost(), {
        schema,
      });

      expect(controller.get("page")).toBe(1);
    });

    it("should use the catch value for a missing key", () => {
      const controller = new URLSearchParamsController(createHost(), {
        schema,
      });

      expect(controller.get("page")).toBe(1);
      expect(controller.get("q")).toBeUndefined();
      expect(controller.get("tags")).toEqual([]);
    });

    it("should turn repeated keys into arrays", () => {
      setUrl("/?tags=a&tags=b");
      const controller = new URLSearchParamsController(createHost(), {
        schema,
      });

      expect(controller.get("tags")).toEqual(["a", "b"]);
    });

    it("should not treat a single value as an array even if the schema defined it as an array", () => {
      setUrl("/?tags=a");
      const controller = new URLSearchParamsController(createHost(), {
        schema,
      });

      expect(controller.get("tags")).toEqual([]);
    });

    it("should keep valid fields when another field falls back", () => {
      setUrl("/?page=abc&q=hello");
      const controller = new URLSearchParamsController(createHost(), {
        schema,
      });

      expect(controller.get("page")).toBe(1);
      expect(controller.get("q")).toBe("hello");
    });

    it("should throw a ZodError when a field has no catch", () => {
      setUrl("/?page=abc");
      const strict = z.object({ page: z.coerce.number().int() });
      const controller = new URLSearchParamsController(createHost(), {
        schema: strict,
      });

      expect(() => controller.get("page")).toThrow(ZodError);
    });
  });

  describe("caching", () => {
    it("should only re-create the search params when it doesn't exist, the url changes, or the values are parsed", () => {
      const urlSpy = vi.spyOn(globalThis, "URL");
      const controller = new URLSearchParamsController(createHost());

      expect(urlSpy).not.toHaveBeenCalled();

      globalThis.dispatchEvent(new PopStateEvent("popstate"));
      expect(urlSpy).not.toHaveBeenCalled();

      expect(controller.searchParams).toBeInstanceOf(URLSearchParams);
      expect(controller.searchParams.get("a")).toBe(null);
      expect(controller.searchParams.get("b")).toBe(null);
      expect(urlSpy).toHaveBeenCalledOnce();

      expect(controller.get("a")).toBe(null);
      expect(controller.get("b")).toBe(null);
      expect(urlSpy).toHaveBeenCalledTimes(2);

      globalThis.dispatchEvent(new PopStateEvent("popstate"));
      // not connected, so no changes
      expect(controller.get("a")).toBe(null);
      expect(urlSpy).toHaveBeenCalledTimes(2);

      controller.hostConnected();
      expect(controller.get("a")).toBe(null);
      expect(urlSpy).toHaveBeenCalledTimes(2);

      globalThis.dispatchEvent(new PopStateEvent("popstate"));
      expect(controller.searchParams.get("a")).toBe(null);
      expect(controller.searchParams.get("b")).toBe(null);
      expect(urlSpy).toHaveBeenCalledTimes(3);
      expect(controller.get("a")).toBe(null);
      expect(controller.get("b")).toBe(null);
      expect(urlSpy).toHaveBeenCalledTimes(4);

      globalThis.dispatchEvent(new PopStateEvent("popstate"));
      // reverse order. the parsing caches the search params
      expect(controller.get("a")).toBe(null);
      expect(controller.searchParams.get("a")).toBe(null);
      expect(urlSpy).toHaveBeenCalledTimes(5);
    });

    it("should only parse when the schema has not been parsed or when the url changes", () => {
      setUrl("/?page=2");
      const schema = z.object({ page: z.coerce.number().catch(1) });
      const safeParse = vi.spyOn(schema, "safeParse");
      const controller = new URLSearchParamsController(createHost(), {
        schema,
      });
      controller.hostConnected();

      expect(safeParse).not.toHaveBeenCalled();

      expect(controller.get("page")).toBe(2);
      expect(controller.get("page")).toBe(2);
      expect(controller.get("page")).toBe(2);
      expect(safeParse).toHaveBeenCalledOnce();

      globalThis.dispatchEvent(new PopStateEvent("popstate"));
      expect(safeParse).toHaveBeenCalledOnce();

      expect(controller.get("page")).toBe(2);
      expect(controller.get("page")).toBe(2);
      expect(controller.get("page")).toBe(2);
      expect(safeParse).toHaveBeenCalledTimes(2);
    });
  });

  describe("updating", () => {
    it("should be able to add params to the url", () => {
      const controller = new URLSearchParamsController(createHost());
      controller.update({ q: "hello", world: "" });
      expect(globalThis.location.search).toBe("?q=hello&world=");
    });

    it("should maintain existing params and add the new ones", () => {
      setUrl("?existing=1&another=hello");

      const controller = new URLSearchParamsController(createHost());
      controller.update({ q: "hello", world: "" });
      expect(globalThis.location.search).toBe(
        "?existing=1&another=hello&q=hello&world=",
      );
    });

    it("should remove values with null or undefined", () => {
      setUrl("?q=hello&v=world");

      const controller = new URLSearchParamsController(createHost());
      controller.update({ q: null });
      expect(globalThis.location.search).toBe("?v=world");

      controller.update({ v: undefined as unknown as null });
      expect(globalThis.location.search).toBe("");
    });

    it("should maintain the pathname and hashes", () => {
      setUrl("/example/pathname?q=whatever#some-id");

      const controller = new URLSearchParamsController(createHost());
      controller.update({ world: "hello" });

      expect(globalThis.location.pathname).toBe("/example/pathname");
      expect(globalThis.location.hash).toBe("#some-id");
      expect(globalThis.location.search).toBe("?q=whatever&world=hello");
    });

    it("should set arrays as repeated keys", () => {
      setUrl("?tags=old");

      const controller = new URLSearchParamsController(createHost());
      controller.update({ tags: ["a", "b"] });
      expect(globalThis.location.search).toBe("?tags=a&tags=b");
    });

    it("should stringify non-string values", () => {
      const schema = z.object({ page: z.number(), open: z.boolean() });
      const controller = new URLSearchParamsController(createHost(), {
        schema,
      });

      controller.update({ page: 2, open: true });

      expect(globalThis.location.search).toBe("?page=2&open=true");
    });

    it("should encode special characters", () => {
      const controller = new URLSearchParamsController(createHost());

      controller.update({ q: "a b&c" });

      expect(new URLSearchParams(globalThis.location.search).get("q")).toBe(
        "a b&c",
      );
    });

    it("should replace the history entry by default", () => {
      const replaceState = vi.spyOn(globalThis.history, "replaceState");
      const pushState = vi.spyOn(globalThis.history, "pushState");
      const controller = new URLSearchParamsController(createHost());

      controller.update({ q: "hello" });

      expect(replaceState).toHaveBeenCalledTimes(1);
      expect(pushState).not.toHaveBeenCalled();
    });

    it("should push a history entry when configured", () => {
      const replaceState = vi.spyOn(globalThis.history, "replaceState");
      const pushState = vi.spyOn(globalThis.history, "pushState");
      const controller = new URLSearchParamsController(createHost());

      controller.update({ q: "hello" }, true);

      expect(pushState).toHaveBeenCalledTimes(1);
      expect(replaceState).not.toHaveBeenCalled();
    });

    it("should be able to notify other connected controllers", async () => {
      const host1 = createHost();
      const host2 = createHost();
      const controller1 = new URLSearchParamsController(host1);
      const controller2 = new URLSearchParamsController(host2);
      controller1.hostConnected();
      controller2.hostConnected();

      expect(controller1.get("a")).toBe(null);
      expect(controller2.get("a")).toBe(null);

      controller1.update({ a: "value" });
      expect(controller1.get("a")).toBe("value");
      expect(controller2.get("a")).toBe("value");
    });

    it("should allow for custom emits with a url", () => {
      const host1 = createHost();
      const host2 = createHost();
      const controller1 = new URLSearchParamsController(host1);
      const controller2 = new URLSearchParamsController(host2);
      controller1.hostConnected();
      controller2.hostConnected();

      expect(controller1.get("a")).toBe(null);
      expect(controller2.get("a")).toBe(null);

      const url = new URL(globalThis.location.href);
      url.searchParams.set("a", "value");
      controller1.emit(url);
      expect(controller1.get("a")).toBe("value");
      expect(controller2.get("a")).toBe("value");
    });

    it("should allow preventing default values from being set in the url by providing the omitDefaults option as an object", () => {
      const controller = new URLSearchParamsController(createHost(), {
        omitDefaults: {
          a: "",
          b: "hello",
          c: "world",
        },
      });

      controller.update({ a: "", b: "hello", c: "world", d: "wow" });
      expect(globalThis.location.search).toBe("?d=wow");
    });

    it("should allow preventing defaults by providing a schema and setting omitDefaults to true", () => {
      const schema = z.object({
        page: z.coerce.number().int().min(1).catch(1),
        q: z.string().optional().catch(undefined),
        tags: z.array(z.string()).catch([]),
      });

      const controller = new URLSearchParamsController(createHost(), {
        schema,
        omitDefaults: true,
      });

      controller.update({ page: 1, q: "wow", tags: [] });
      expect(globalThis.location.search).toBe("?q=wow");
    });
  });
});
