/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
 */
export class AsyncClickEvent extends Event {
  readonly promises: Promise<unknown>[] = [];

  constructor(eventInitDict?: EventInit) {
    super("async-click", eventInitDict);
  }

  waitUntil(promise: Promise<unknown>): void {
    this.promises.push(promise);
  }
}

declare global {
  interface HTMLElementEventMap {
    "async-click": AsyncClickEvent;
  }
}
