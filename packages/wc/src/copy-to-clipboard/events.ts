import { AsyncEvent, type AsyncEventInit } from "../utils/async-event.js";
import type {
  ClipboardCopyErrorEventDetail,
  ClipboardCopyEventDetail,
  ClipboardData,
} from "./types.js";

export class ClipboardCopyDataEvent extends AsyncEvent<ClipboardData> {
  static readonly type = "clipboard-copy-data";

  constructor(eventInitDict?: AsyncEventInit) {
    super(ClipboardCopyDataEvent.type, eventInitDict);
  }
}

export class ClipboardCopyEvent extends Event {
  static readonly type = "clipboard-copy";
  readonly data: ClipboardData;

  constructor(detail: ClipboardCopyEventDetail, eventInitDict?: EventInit) {
    super(ClipboardCopyEvent.type, eventInitDict);

    this.data = detail.data;
  }
}

export class ClipboardCopyErrorEvent extends Event {
  static readonly type = "clipboard-copy-error";
  readonly data: ClipboardData;
  readonly error: unknown;

  constructor(
    detail: ClipboardCopyErrorEventDetail,
    eventInitDict?: EventInit,
  ) {
    super(ClipboardCopyErrorEvent.type, eventInitDict);

    this.data = detail.data;
    this.error = detail.error;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    "clipboard-copy-data": ClipboardCopyDataEvent;
    "clipboard-copy": ClipboardCopyEvent;
    "clipboard-copy-error": ClipboardCopyErrorEvent;
  }
}
