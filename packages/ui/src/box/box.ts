import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin.js";
import boxStyles from "./box-styles.js";
import {
  type BoxAlignItems,
  type BoxGap,
  type BoxGrid,
  type BoxJustifyContent,
  type BoxPadding,
} from "./types.js";

const BaseBox = MarginMixin(LitElement);

@customElement("ui-box")
export class Box extends BaseBox {
  static override styles = [...BaseBox.styles, boxStyles];

  @property()
  align?: BoxAlignItems;

  @property()
  justify?: BoxJustifyContent;

  @property({ reflect: false })
  grid: BoxGrid = false;

  @property({ type: Boolean, attribute: "full-width" })
  fullWidth?: boolean;

  @property({ type: Boolean })
  stacked?: boolean;

  @property({ type: Boolean })
  reversed?: boolean;

  @property({ reflect: true })
  gap: BoxGap = "all";

  @property({ type: Boolean })
  nowrap?: boolean;

  @property()
  padding?: BoxPadding;

  #updateGridColumns(): void {
    if (typeof this.grid === "string" && /^\d+$/.test(this.grid)) {
      this.style.setProperty("--ui-box-columns", this.grid);
    } else {
      this.style.removeProperty("--ui-box-columns");
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#updateGridColumns();
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("grid")) {
      this.#updateGridColumns();
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

// declare global {
//   interface HTMLElementTagNameMap {
//     "ui-box": Box;
//   }
// }
