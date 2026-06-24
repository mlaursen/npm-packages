import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  isServer,
} from "lit";
import { customElement, property } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import boxStyles from "./box-styles.js";
import {
  type BoxAlignItems,
  type BoxGap,
  type BoxGrid,
  type BoxJustifyContent,
  type BoxPadding,
  type BoxProperties,
} from "./types.js";

const BaseBox = PaletteMixin(MarginMixin(LitElement));

@customElement("mwc-box")
export class Box extends BaseBox implements BoxProperties {
  static override styles = [...BaseBox.styles, boxStyles];

  @property()
  align?: BoxAlignItems;

  @property()
  justify?: BoxJustifyContent;

  @property({ type: Boolean })
  inline = false;

  @property({ reflect: false })
  grid: BoxGrid = false;

  @property({ type: Boolean, attribute: "full-width" })
  fullWidth?: boolean;

  @property({ type: Boolean, reflect: true })
  stacked?: boolean;

  @property({ type: Boolean })
  reversed?: boolean;

  @property({ reflect: true })
  gap: BoxGap = "all";

  @property({ type: Boolean })
  nowrap?: boolean;

  @property({ reflect: true })
  padding: BoxPadding = "all";

  override connectedCallback(): void {
    super.connectedCallback();

    this.#updateGridColumns();
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (isServer) {
      return;
    }

    if (changed.has("grid")) {
      this.#updateGridColumns();
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  #updateGridColumns(): void {
    const property = "--mwc-box-columns";
    if (typeof this.grid === "string" && /^\d+$/.test(this.grid)) {
      this.style.setProperty(property, this.grid);
    } else {
      this.style.removeProperty(property);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-box": Box;
  }
}
