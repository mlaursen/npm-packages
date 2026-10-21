import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("copy-to-clipboard")
export class CopyToClipboard extends LitElement {
  static override styles = [
    css`
      :host {
        top: 0.25rem;
        inset-inline-start: auto;
        inset-inline-end: 1rem;
        position: absolute;
      }
    `,
  ];

  override render(): TemplateResult {
    return html`
      <mwc-tooltip anchor-x="left" anchor-y="center">
        <span slot="tooltip">Copy to clipboard</span>
        <mwc-icon-button
          slot="popover-target"
          aria-label="Copy to clipboard"
          class="copy-to-clipboard"
          @click=${this.#copyToClipboard}
        >
          <mwc-material-symbol>content_copy</mwc-material-symbol>
        </mwc-icon-button>
      </mwc-tooltip>
    `;
  }

  async #copyToClipboard(): Promise<void> {
    const code =
      this.closest("mwc-code-block")?.querySelector("pre")?.textContent;
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent("clipboard-copy-error", {
          bubbles: true,
          composed: true,
          detail: {
            text: code,
            error,
          },
        }),
      );
      return;
    }

    this.dispatchEvent(
      new CustomEvent("clipboard-copy", {
        bubbles: true,
        composed: true,
        detail: { text: code },
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "copy-to-clipboard": CopyToClipboard;
  }
}
