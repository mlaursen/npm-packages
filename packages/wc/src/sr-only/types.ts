import type { MediaQueryNameOrQuery } from "../media-queries/types.js";

export interface SrOnlyProperties {
  /**
   * This is used to enable/disable the screen reader only behavior. This
   * is automatically toggled by {@link activeMedia}.
   *
   * @defaultValue `true`
   */
  active: boolean;

  /**
   * This can be used to only enable the sr-only behavior at certain
   * breakpoints or media-queries. For example, showing sr-only text in buttons
   * for phones when only icons should be shown.
   *
   * @defaultValue `null`
   */
  activeMedia: MediaQueryNameOrQuery | null;

  /**
   * Set this to `true` if the content should be visible while focused or
   * focus within. Requires setting `tabindex="0"` or having focusable
   * content.
   *
   * @defaultValue `false`
   */
  focusable: boolean;
}
