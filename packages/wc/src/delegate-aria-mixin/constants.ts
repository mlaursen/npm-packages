export const MIRRORED_ARIA_ATTRIBUTES = new Set([
  "aria-disabled",
  "aria-expanded",
  "aria-pressed",
]);

/**
 * NOTE: id refs are not supported since they are not supported cross shadow
 * boundaries.
 */
export const ARIA_ATTRIBUTES: ReadonlySet<string> = new Set([
  ...MIRRORED_ARIA_ATTRIBUTES,
  "aria-label",
  "aria-description",
  "aria-haspopup",
  "aria-current",
  "aria-keyshortcuts",
]);
