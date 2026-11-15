export type AsyncEventInit = EventInit;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
 */
export class AsyncEvent<Result = unknown> extends Event {
  readonly promises: Promise<Result>[] = [];

  waitUntil(promise: Promise<Result>): void {
    this.promises.push(promise);
  }
}
