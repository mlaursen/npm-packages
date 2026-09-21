/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * NOTE: This was copied from: https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/internal/events/redispatch-event.ts
 */
export function redispatchEvent(element: Element, event: Event): boolean {
  if (event.bubbles && (!element.shadowRoot || event.composed)) {
    event.stopPropagation();
  }

  const clonedEvent: Event = Reflect.construct(event.constructor, [
    event.type,
    event,
  ]);
  const dispatched = element.dispatchEvent(clonedEvent);
  if (!dispatched) {
    clonedEvent.preventDefault();
  }

  return dispatched;
}
