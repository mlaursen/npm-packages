export const IS_FOCUSABLE =
  ":is(input, button, textarea, select, :is(a,area)[href], [tabindex], [contenteditable])";
export const NOT_DISABLED_OR_HIDDEN = ":not(:disabled, [disabled], [hidden])";
export const NOT_NEGATIVE_TABINDEX = ':not([tabindex^="-"])';
export const FOCUSABLE = `${IS_FOCUSABLE}${NOT_DISABLED_OR_HIDDEN}${NOT_NEGATIVE_TABINDEX}`;
