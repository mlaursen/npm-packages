import {
  AsyncClickEvent,
  type AsyncClickEventOptions,
} from "./async-click-event.js";

const noop = (): void => {
  // do nothing
};

export interface DispatchAsyncEventOptions extends AsyncClickEventOptions {
  /**
   * @override
   * @defaultValue `true`
   */
  bubbles?: boolean;

  /**
   * @override
   * @defaultValue `true`
   */
  composed?: boolean;

  /**
   * The element that should trigger the `dispatchEvent`.
   */
  element: HTMLElement;

  /**
   * This will only be called if at least one promise was added to
   * `event.waitUntil`.
   */
  onBeforeWait?: () => void;
}

export interface DispatchAsyncEventResult {
  awaited: boolean;
  results: readonly PromiseSettledResult<unknown>[];
  rejected: boolean;
}

/**
 * This is used to dispatch or redispatch the {@link AsyncClickEvent} from a
 * custom element.
 *
 * @example Async Button Example
```ts
await dispatchAsyncEvent({
  element: this,
  onBeforeWait: () => {
    this.pending = true;
  },
});
this.pending = false;
```
 *
 * @see redispatchAsyncEvent to shadow boundary crossing
 */
export async function dispatchAsyncEvent(
  options: DispatchAsyncEventOptions,
): Promise<DispatchAsyncEventResult> {
  const { element, onBeforeWait = noop, ...eventInit } = options;

  const asyncEvent = new AsyncClickEvent({
    bubbles: true,
    composed: true,
    ...eventInit,
  });
  element.dispatchEvent(asyncEvent);
  if (asyncEvent.promises.length === 0) {
    return {
      awaited: false,
      results: [],
      rejected: false,
    };
  }

  onBeforeWait();
  const results = await Promise.allSettled(asyncEvent.promises);
  let rejected = false;
  for (const result of results) {
    if (result.status === "rejected") {
      rejected = true;
      reportError(result.reason);
    }
  }

  return {
    awaited: true,
    results,
    rejected,
  };
}

export interface RedispatchAsyncEventOptions extends DispatchAsyncEventOptions {
  sourceEvent: AsyncClickEvent;
}

/**
 * This is used to redispatch an async event when capturing an `"async-click"`
 * event on a child in the shadow boundary.
 *
 * @example Main Example
```ts
async #handleAction(event: AsyncClickEvent): Promise<void> {
  const { rejected } = await redispatchAsyncEvent({
    element: this,
    sourceEvent: event,
  });
  if (!rejected) {
    this.close();
  }
}
```
 */
export async function redispatchAsyncEvent(
  options: RedispatchAsyncEventOptions,
): Promise<DispatchAsyncEventResult> {
  const { sourceEvent, ...dispatchOptions } = options;

  const result = dispatchAsyncEvent(dispatchOptions);
  sourceEvent.waitUntil(result);
  return result;
}
