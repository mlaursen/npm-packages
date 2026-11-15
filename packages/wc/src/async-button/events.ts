import { AsyncEvent, type AsyncEventInit } from "../utils/async-event.js";

export class AsyncClickEvent extends AsyncEvent {
  static readonly type = "async-click";

  constructor(options?: AsyncEventInit) {
    super(AsyncClickEvent.type, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    "async-click": AsyncClickEvent;
  }
}
