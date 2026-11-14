import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PopoverMixin } from "../popover/popover-mixin.js";
import type { PopoverInitiator, PopoverType } from "../popover/types.js";
import { isElementClipped } from "../utils/isElementClipped.js";
import { isSlotted } from "../utils/slots.js";
import { traverse } from "../utils/traverse.js";
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
 * @see PopoverMixin for additional configuration options
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
  static readonly elementName: string = "mwc-tooltip";

  override popoverType: PopoverType = "hint";
  override popoverInitiator: PopoverInitiator = "no-click";

  @property({ attribute: "overflow-only", type: Boolean })
  overflowOnly = false;

  @state()
  _hasContent = false;

  protected override render(): TemplateResult {
    return this.renderPopover({
      content: html`<slot
        name="tooltip"
        @slotchange=${this.#handleContentSlotChange}
      ></slot>`,
    });
  }

  override isPopoverOpenable(): boolean {
    return (
      super.isPopoverOpenable() && (!this.overflowOnly || this.#isOverflown())
    );
  }

  #isOverflown(): boolean {
    return (
      !!this._popoverTarget &&
      this._popoverTarget.assignedElements({ flatten: true }).some(
        (element) =>
          isElementClipped(element) ||
          traverse({
            root: element,
            first: true,
            check: isElementClipped,
          }),
      )
    );
  }

  #handleContentSlotChange(event: Event): void {
    this._hasContent = isSlotted(event);
    this.requestUpdate("_hasPopoverTarget");
  }

  override isPopoverEnabled(): boolean {
    return super.isPopoverEnabled() && this._hasContent;
  }
}
