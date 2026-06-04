const IS_FOCUSABLE =
  ":is(input, button, textarea, select, :is(a,area)[href], [tabindex], [contenteditable])";
const NOT_DISABLED = ":not(:disabled, [disabled])";
const NOT_NEGATIVE_TABINDEX = ':not([tabindex^="-"])';
const FOCUSABLE = `${IS_FOCUSABLE}${NOT_DISABLED}${NOT_NEGATIVE_TABINDEX}`;

export function isFocusable(element: Element | Node): element is HTMLElement {
  if (!("matches" in element)) {
    return false;
  }

  if (element.matches(FOCUSABLE)) {
    return true;
  }

  if (!element.localName.includes("-") || element.matches(NOT_DISABLED)) {
    return false;
  }

  return element.shadowRoot?.delegatesFocus ?? false;
}
