import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { ZodType } from "zod";

import type {
  URLSearchParamsControllerOptions,
  URLSearchParamsControllerValues,
} from "./types.js";

const URL_CHANGE_EVENT = "urlchange";

export class URLSearchParamsController<
  Schema extends ZodType | undefined = undefined,
> implements ReactiveController {
  readonly #host: ReactiveControllerHost;
  readonly #schema: Schema | undefined;
  #cached: URLSearchParamsControllerValues<Schema> | null = null;
  #searchParams: URLSearchParams | null = null;
  #defaults: URLSearchParamsControllerValues<Schema> | null = null;

  constructor(
    host: ReactiveControllerHost,
    options: URLSearchParamsControllerOptions<Schema> = {},
  ) {
    this.#host = host;
    this.#schema = options.schema;

    if (options.omitDefaults === true && this.#schema) {
      this.#defaults = (this.#schema.safeParse({}).data ??
        {}) as URLSearchParamsControllerValues<Schema>;
    } else if (
      typeof options.omitDefaults !== "boolean" &&
      options.omitDefaults
    ) {
      this.#defaults = options.omitDefaults;
    }

    host.addController(this);
  }

  hostConnected(): void {
    globalThis.addEventListener("popstate", this.#handleChange);
    globalThis.addEventListener(URL_CHANGE_EVENT, this.#handleChange);
  }

  hostDisconnected(): void {
    globalThis.removeEventListener("popstate", this.#handleChange);
    globalThis.removeEventListener(URL_CHANGE_EVENT, this.#handleChange);
  }

  #handleChange = (): void => {
    this.#cached = null;
    this.#searchParams = null;
    this.#host.requestUpdate();
  };

  #parse(): URLSearchParamsControllerValues<Schema> {
    if (this.#cached) {
      return this.#cached;
    }

    const searchParams = new URL(globalThis.location.href).searchParams;
    this.#searchParams = searchParams;

    const keys = new Set(searchParams.keys());
    if (this.#schema) {
      // allow the zod schema to parse arrays
      const params: Record<string, string | string[]> = {};
      for (const key of keys) {
        const values = searchParams.getAll(key);
        params[key] = values.length > 1 ? values : (values[0] ?? "");
      }

      const result = this.#schema.safeParse(params);
      if (!result.success) {
        throw result.error;
      }

      this.#cached = result.data as URLSearchParamsControllerValues<Schema>;
      return this.#cached;
    }

    // mimic the default behavior where the first value is returned for
    // repeated keys
    const params: Record<string, string | null> = {};
    for (const key of keys) {
      params[key] = searchParams.get(key);
    }
    this.#cached = params as URLSearchParamsControllerValues<Schema>;
    return this.#cached;
  }

  get searchParams(): URLSearchParams {
    this.#searchParams ??= new URL(globalThis.location.href).searchParams;
    return this.#searchParams;
  }

  /**
   * This can be used to manually emit a new url.
   */
  emit(url: URL, push = false): void {
    globalThis.history[push ? "pushState" : "replaceState"](null, "", url);
    globalThis.dispatchEvent(new CustomEvent(URL_CHANGE_EVENT));
  }

  get<K extends keyof URLSearchParamsControllerValues<Schema>>(
    key: K,
  ): URLSearchParamsControllerValues<Schema>[K] {
    const params = this.#parse();
    const value = params[key];

    return this.#schema
      ? value
      : ((value ?? null) as URLSearchParamsControllerValues<Schema>[K]);
  }

  update(changes: URLSearchParamsControllerValues<Schema>, push = false): void {
    const url = new URL(globalThis.location.href);
    for (const [key, value] of Object.entries(changes)) {
      url.searchParams.delete(key);

      const isDefault =
        this.#defaults &&
        key in this.#defaults &&
        value ===
          this.#defaults[key as keyof URLSearchParamsControllerValues<Schema>];
      if (value === null || value === undefined || isDefault) {
        continue;
      }

      const values = Array.isArray(value) ? value : [value];
      for (const item of values) {
        url.searchParams.append(key, String(item));
      }
    }

    this.#searchParams = url.searchParams;
    this.#cached = null;
    this.emit(url, push);
  }
}

declare global {
  interface WindowEventMap {
    urlchange: CustomEvent<void>;
  }
}
