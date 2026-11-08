export interface AsyncClickEventOptions extends EventInit {
  /** @defaultValue `"async-click"` */
  name?: string;
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
 */
export class AsyncClickEvent<Result = unknown> extends Event {
  readonly promises: Promise<Result>[] = [];

  constructor(options: AsyncClickEventOptions = {}) {
    const { name = "async-click", ...eventInitDict } = options;
    super(name, eventInitDict);
  }

  waitUntil(promise: Promise<Result>): void {
    this.promises.push(promise);
  }
}

declare global {
  interface HTMLElementEventMap {
    "async-click": AsyncClickEvent;
  }
}
