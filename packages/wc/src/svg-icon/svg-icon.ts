import { type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Icon } from "../icon/icon.js";
import styles from "./svg-icon-styles.js";
import type { SvgIconProperties } from "./types.js";

/**
 * This component is quite as useful as others since you must have valid html
 * for slots. I was hoping to do:
 * ```ts
 * <mwc-svg-icon>
 *   <path d="..." />
 * </mwc-svg-icon>
 * ```
 *
 * but that fails. So all this really does is apply the icon styling:
 *
 * ```ts
 * <mwc-svg-icon>
 *   <svg>
 *     <path d="..." />
 *   </svg>
 * </mwc-svg-icon>
 * ```
 */
@customElement("mwc-svg-icon")
export class SvgIcon extends Icon implements SvgIconProperties {
  static override styles = [...Icon.styles, styles];

  @property()
  viewBox = "0 0 24 24";

  #handleSlotChange(event: Event): void {
    const svg = (event.target as HTMLSlotElement)?.assignedElements()?.[0];
    if (!svg || svg.getAttribute("viewBox")) {
      return;
    }

    svg.setAttribute("viewBox", this.viewBox);
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#handleSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-svg-icon": SvgIcon;
  }
}
