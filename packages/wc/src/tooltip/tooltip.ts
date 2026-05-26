import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PopoverMixin } from "../popover/popover-mixin.js";
import { type PopoverBehavior } from "../popover/types.js";
import styles from "./tooltip-styles.js";
import { type TooltipProperties } from "./types.js";

const BaseTooltip = MarginMixin(PopoverMixin(LitElement));

/**
 * @example Simple Example
 * ```ts
 * <mwc-tooltip>
 *   <mwc-button slot="target">Button</mwc-button>
 *   <span slot="tooltip">I am a tooltip!</span>
 * </mwc-tooltip>
 * ```
 */
@customElement("mwc-tooltip")
export class Tooltip extends BaseTooltip implements TooltipProperties {
  static override styles = [...BaseTooltip.styles, styles];

  override popoverBehavior: PopoverBehavior = "hint";

  protected override render(): TemplateResult {
    return this.renderPopoverTarget({
      content: html`<slot name="tooltip"></slot>`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-tooltip": Tooltip;
  }
}
