import { dispatchAsyncEvent } from "../utils/dispatch-async-event.js";
import {
  ClipboardCopyDataEvent,
  ClipboardCopyErrorEvent,
  ClipboardCopyEvent,
} from "./events.js";
import type {
  ClipboardCopyErrorEventDetail,
  ClipboardCopyEventDetail,
  ClipboardData,
  CopyToClipboardOptions,
} from "./types.js";

const noop = (): void => {
  // do nothing
};

async function tryAsyncClickEvent<D extends ClipboardData>(
  element: HTMLElement | undefined,
): Promise<D | undefined> {
  if (!element) {
    return;
  }

  const { awaited, rejected, fulfilled } = await dispatchAsyncEvent({
    EventClass: ClipboardCopyDataEvent,
    element,
    bubbles: true,
    composed: true,
  });

  if (!awaited || rejected || fulfilled.length !== 1) {
    return;
  }

  const data = fulfilled[0];
  if (
    typeof data !== "string" &&
    !(data instanceof ClipboardItem) &&
    (!Array.isArray(data) ||
      !data.every((item) => item instanceof ClipboardItem))
  ) {
    throw new TypeError(
      'The "clipboard-copy-data" event only accepts strings, ClipboardItem, or ClipboardItems',
    );
  }

  return data as D;
}

export async function copyToClipboard<D extends ClipboardData>(
  options: Readonly<CopyToClipboardOptions<D>>,
): Promise<void> {
  const {
    data,
    element,
    allowEmpty = false,
    onCopy = noop,
    onError = noop,
  } = options;

  let resolved: D;
  if (data === undefined) {
    const loaded = await tryAsyncClickEvent<D>(element);
    if (loaded === undefined) {
      return;
    }

    resolved = loaded;
  } else {
    resolved = data;
  }

  if (
    !allowEmpty &&
    (!resolved || (Array.isArray(resolved) && resolved.length === 0))
  ) {
    return;
  }

  let promise: Promise<void>;
  if (typeof resolved === "string") {
    promise = navigator.clipboard.writeText(resolved);
  } else {
    promise = navigator.clipboard.write(
      resolved instanceof ClipboardItem ? [resolved] : resolved,
    );
  }

  try {
    await promise;
  } catch (error) {
    const detail: ClipboardCopyErrorEventDetail<D> = {
      data: resolved,
      error,
    };

    element?.dispatchEvent(
      new ClipboardCopyErrorEvent(detail, { bubbles: true, composed: true }),
    );
    onError(detail);

    return;
  }

  const detail: ClipboardCopyEventDetail<D> = { data: resolved };
  element?.dispatchEvent(
    new ClipboardCopyEvent(detail, { bubbles: true, composed: true }),
  );
  onCopy(detail);
}
