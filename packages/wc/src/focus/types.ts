import type { TemplateResult } from "lit";

export interface FocusTrapProperties {
  /**
   * @defaultValue `false`
   */
  disableFocusTrap?: boolean;

  /**
   * This is used when there are no focusable elements within the component and
   * should fallback to focusing itself.
   */
  getFallbackFocus: () => HTMLElement | null | undefined;

  /**
   * This should be called in the render at the beginning and end of the
   * focus trap area. It will need to be called with `true` and `false` so
   * a first and last marker can be rendered.
   *
   * @param isFirst - true if the first focus trap
   */
  renderFocusTrap: (isFirst: boolean) => TemplateResult | null;
}
