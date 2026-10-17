import type { ReactiveController, ReactiveControllerHost } from "lit";

const URL_CHANGE = "urlchange";

export class URLSearchParamsController<
  Params extends Record<keyof Params, string | null> = Record<
    string,
    string | null
  >,
> implements ReactiveController {
  #url: URL;
  #host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    this.#url = new URL(globalThis.location.href);
    this.#host = host;
    this.#host.addController(this);
  }

  hostConnected(): void {
    globalThis.addEventListener("popstate", this.#handleChange);
    globalThis.addEventListener(URL_CHANGE, this.#handleChange);
  }

  hostDisconnected(): void {
    globalThis.removeEventListener("popstate", this.#handleChange);
    globalThis.removeEventListener(URL_CHANGE, this.#handleChange);
  }

  #handleChange = (): void => {
    this.#url = new URL(globalThis.location.href);
    this.#host.requestUpdate();
  };

  get<K extends keyof Params & string>(key: K): Params[K] | null {
    return this.#url.searchParams.get(key) as Params[K] | null;
  }

  update(changes: Params, push = false): void {
    const url = new URL(globalThis.location.href);
    for (const [key, value] of Object.entries(changes)) {
      if (typeof value === "string") {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    }

    globalThis.history[push ? "pushState" : "replaceState"](null, "", url);
    globalThis.dispatchEvent(new Event(URL_CHANGE));
  }
}
