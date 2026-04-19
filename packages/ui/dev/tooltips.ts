import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  HorizontalPosition,
  VerticalPosition,
} from "../src/popover/types.js";

@customElement("app-tooltips")
export class Tooltips extends LitElement {
  @property({ type: Boolean })
  invisible = false;

  @state()
  _visible = true;

  override render(): TemplateResult | null {
    if (this.invisible) {
      return null;
    }

    return html`
      <ui-box stacked align="start" style="padding-bottom: 20rem;">
        <ui-typography variant="display" margin="top">
          <h3>Tooltips</h3>
        </ui-typography>
        <ui-box>
          <ui-button
            @click=${() => {
              this._visible = !this._visible;
            }}
          >
            ${this._visible ? "Hide" : "Show"}
          </ui-button>
        </ui-box>
        ${this.#renderEverything()}
      </ui-box>
    `;
  }

  #renderEverything(): TemplateResult | null {
    if (!this._visible) {
      return null;
    }

    const anchorXs: HorizontalPosition[] = [
      "left",
      "inner-left",
      "center",
      "inner-right",
      "right",
    ];
    const anchorYs: VerticalPosition[] = [
      "above",
      "top",
      "center",
      "bottom",
      "below",
    ];

    return html`
      <ui-box stacked full-width style="--ui-box-gap: 8rem">
        ${anchorXs.map((anchorX) =>
          anchorYs.map(
            (anchorY) => html`
              <ui-tooltip anchor-x=${anchorX} anchor-y=${anchorY}>
                <ui-button slot="target">${anchorX} - ${anchorY}</ui-button>
                <span slot="tooltip">This is a tooltip!</span>
              </ui-tooltip>
            `,
          ),
        )}
      </ui-box>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-tooltips": Tooltips;
  }
}
