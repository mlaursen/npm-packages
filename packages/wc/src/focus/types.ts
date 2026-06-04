import type { TemplateResult } from "lit";

export interface FocusTrapProperties {
  disableFocusTrap?: boolean;

  getFallbackFocus: () => HTMLElement | null | undefined;

  renderFocusTrap: () => TemplateResult | null;
}
