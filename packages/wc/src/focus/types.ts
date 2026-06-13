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
   * focus trap area.
   *
   * @param position
   */
  renderFocusTrap: (position: "first" | "last") => TemplateResult | null;
}
