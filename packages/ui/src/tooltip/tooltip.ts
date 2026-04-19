import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import { PopoverMixin } from "../popover/popover.js";
import { type PopoverBehavior } from "../popover/types.js";
import styles from "./tooltip-styles.js";

const BaseTooltip = PopoverMixin(LitElement);

@customElement("ui-tooltip")
export class Tooltip extends BaseTooltip {
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
    "ui-tooltip": Tooltip;
  }
}
