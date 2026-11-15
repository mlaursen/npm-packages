import type { AsyncEvent } from "./async-event.js";
import { type AsyncEventInit } from "./async-event.js";

const noop = (): void => {
  // do nothing
};

export interface DispatchAsyncEventOptions<
  Result = unknown,
> extends AsyncEventInit {
  /**
   * The element that should trigger the `dispatchEvent`.
   */
  element: HTMLElement;

  /**
   * This will only be called if at least one promise was added to
   * `event.waitUntil`.
   */
  onBeforeWait?: () => void;

  EventClass: new (init?: AsyncEventInit) => AsyncEvent<Result>;
}

export interface DispatchAsyncEventResult<Result = unknown> {
  awaited: boolean;
  results: readonly PromiseSettledResult<Result>[];
  rejected: boolean;
  fulfilled: readonly Result[];
}

/**
 * This is used to dispatch or redispatch the {@link AsyncEvent} from a
 * custom element.
 *
 * @example Async Button Example
```ts
await dispatchAsyncEvent({
  EventClass: AsyncClickEvent,
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
export async function dispatchAsyncEvent<Result = unknown>(
  options: DispatchAsyncEventOptions<Result>,
): Promise<DispatchAsyncEventResult<Result>> {
  const {
    element,
    onBeforeWait = noop,
    EventClass,
    ...eventInitDict
  } = options;

  const asyncEvent = new EventClass(eventInitDict);
  element.dispatchEvent(asyncEvent);
  if (asyncEvent.promises.length === 0) {
    return {
      awaited: false,
      results: [],
      rejected: false,
      fulfilled: [],
    };
  }

  onBeforeWait();
  const results = await Promise.allSettled(asyncEvent.promises);

  let rejected = false;
  const fulfilled: Result[] = [];
  for (const result of results) {
    if (result.status === "rejected") {
      rejected = true;
      reportError(result.reason);
    } else {
      fulfilled.push(result.value);
    }
  }

  return {
    awaited: true,
    results,
    rejected,
    fulfilled,
  };
}

export interface RedispatchAsyncEventOptions extends DispatchAsyncEventOptions {
  sourceEvent: AsyncEvent;
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
