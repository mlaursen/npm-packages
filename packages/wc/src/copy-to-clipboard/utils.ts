import { AsyncClickEvent } from "../utils/async-click-event.js";
import type {
  ClipboardData,
  CopyToClipboardOptions,
  ClipboardCopyEventDetail,
  ClipboardCopyErrorEventDetail,
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

  const asyncEvent = new AsyncClickEvent<string | ClipboardItems>({
    name: "clipboard-copy-data",
    bubbles: true,
    composed: true,
  });
  element.dispatchEvent(asyncEvent);
  if (asyncEvent.promises.length !== 1) {
    return;
  }

  let data: ClipboardData | undefined;
  try {
    data = await asyncEvent.promises[0];
  } catch {
    // silently fail if these promises failed
    return;
  }

  // but throw error if invalid type was returned
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
      new CustomEvent("clipboard-copy-error", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
    onError(detail);

    return;
  }

  const detail: ClipboardCopyEventDetail<D> = { data: resolved };
  element?.dispatchEvent(
    new CustomEvent("clipboard-copy", {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
  onCopy(detail);
}

declare global {
  interface HTMLElementEventMap {
    "clipboard-copy-data": AsyncClickEvent<ClipboardData>;
    "clipboard-copy": CustomEvent<ClipboardCopyEventDetail>;
    "clipboard-copy-error": CustomEvent<ClipboardCopyErrorEventDetail>;
  }

  interface WindowEventMap {
    "clipboard-copy-data": AsyncClickEvent<ClipboardData>;
    "clipboard-copy": CustomEvent<ClipboardCopyEventDetail>;
    "clipboard-copy-error": CustomEvent<ClipboardCopyErrorEventDetail>;
  }
}
