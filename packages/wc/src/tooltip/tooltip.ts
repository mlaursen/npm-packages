import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PopoverMixin } from "../popover/popover-mixin.js";
import type { PopoverInitiator, PopoverType } from "../popover/types.js";
import styles from "./tooltip-styles.js";
import type { TooltipProperties } from "./types.js";

const BaseTooltip = MarginMixin(PopoverMixin(LitElement));

/**
 * @example Simple Example
```html
<mwc-tooltip>
  <mwc-button slot="popover-target">Button</mwc-button>
  <span slot="tooltip">I am a tooltip!</span>
</mwc-tooltip>
```
 *
 * @slot tooltip - Required slot for the content to display in the tooltip.
 * This must not contain focusable content and should normally be a short
 * description.
 * @slot popover-target - Required slot that is used to be the anchor element
 * and used to show/hide the tooltip.
 *
 * @fires {Event} open - Fired before the show animation occurs and can be used
 * to cancel opening the element by calling `event.preventDefault()`.
 * @fires {Event} opened - Fired once the element has opened and the animations
 * have completed.
 * @fires {Event} close - Fired before the hide animation occurs and can be
 * used to cancel closing the element by calling `event.preventDefault()`.
 * @fires {Event} closed - Fired once the element has closed and the animations
 * have completed.
 */
export class Tooltip extends BaseTooltip implements TooltipProperties {
  static override styles = [...BaseTooltip.styles, styles];

  override popoverType: PopoverType = "hint";
  override popoverInitiator: PopoverInitiator = "no-click";

  protected override render(): TemplateResult {
    return this.renderPopover({
      content: html`<slot name="tooltip"></slot>`,
    });
  }
}
