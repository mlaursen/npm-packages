import { titleCase } from "@mlaursen/utils";
import type { MaterialSymbolProperties } from "@mlaursen/wc";
import { redispatchEvent } from "@mlaursen/wc";
import { spread } from "@open-wc/lit-helpers";
import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { icon, theme } from "../../../../packages/wc/wc.11tydata.js";
import template from "./template.md";

import styles from "./selected-dialog.scss";

@customElement("selected-dialog")
export class SelectedDialog extends LitElement {
  static override styles = styles;

  @property()
  icon = "";

  @property({ type: Boolean })
  loading = false;

  override render(): TemplateResult {
    const title = titleCase(this.icon.replaceAll("_", " "), " ");
    const code = template
      .replace("pre", 'pre slot="pre"')
      .replace("favorite", this.icon);

    return html`<mwc-dialog
      id="selected-dialog"
      aria-label="${title}"
      ?open=${!!this.icon}
      @closed=${(event: Event) => {
        redispatchEvent(this, event);
      }}
      width="medium"
    >
      <h3 id="title" slot="title">
        <copy-to-clipboard>${this.icon}</copy-to-clipboard>
      </h3>
      <mwc-code-block>${unsafeHTML(code)}</mwc-code-block>
      <mwc-box grid="2" align="start">
        ${this.#renderSymbol({ className: "preview" })}
        <mwc-box grid="3" padding="none" style="--mwc-box-item-min-size: auto;">
          ${map(icon.sizes, (size) => this.#renderSymbol({ size }))}
          ${map(theme.baseThemes.slice(0, 3), (color) => this.#renderSymbol({ color }))}
          ${map(theme.baseThemes.slice(0, 3), (background) => this.#renderSymbol({ background }))}
        </mwc-box>
      </mwc-box>
      <mwc-button
        command="--close"
        commandfor="selected-dialog"
        slot="actions"
        variant="outlined"
        >Close</mwc-button
      >
    </mwc-dialog>`;
  }

  #renderSymbol(
    overrides: MaterialSymbolProperties & { className?: string } = {},
  ): TemplateResult {
    const { className = "", ...props } = overrides;

    let content: TemplateResult;
    if (this.loading) {
      content = html`
        <mwc-skeleton ?active=${this.loading} size="content" variant="diagonal">
          <mwc-material-symbol class="${className}" ${spread(props)}
            >${this.icon}</mwc-material-symbol
          >
        </mwc-skeleton>
      `;
    } else {
      let tooltip: TemplateResult | undefined;
      if ("size" in props) {
        tooltip = html`<span slot="tooltip">size=${props.size}</span>`;
      } else if ("color" in props) {
        tooltip = html`<span slot="tooltip">color=${props.color}</span>`;
      }

      content = html`
        <mwc-tooltip popover-arrow>
          ${tooltip}
          <mwc-material-symbol
            slot="popover-target"
            class="${className}"
            ${spread(props)}
            >${this.icon}</mwc-material-symbol
          >
        </mwc-tooltip>
      `;
    }

    return html` <mwc-box padding="none"> ${content} </mwc-box> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "selected-dialog": SelectedDialog;
  }
}
