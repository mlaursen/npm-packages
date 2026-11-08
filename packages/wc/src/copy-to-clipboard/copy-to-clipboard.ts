import {
  LitElement,
  html,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property } from "lit/decorators.js";

import { MediaQueryController } from "../media-queries/media-query-controller.js";
import type { MediaQueryNameOrQuery } from "../media-queries/types.js";
import type { HorizontalAnchor, VerticalAnchor } from "../popover/types.js";
import styles from "./copy-to-clipboard-styles.js";
import type {
  CopyToClipboardPosition,
  CopyToClipboardProperties,
} from "./types.js";
import { copyToClipboard } from "./utils.js";

/**
 * @slot override - An optional slot that allows you to override all the
 * default elements which is useful if you don't need a focusable/clickable
 * button with a tooltip to be the element that triggers the clipboard event.
 * @slot tooltip - An optional slot to override the default tooltip content
 * which is just `Copy to clipboard`.
 * @slot button - An optional slot to override the default tooltipped icon
 * button which renders with an `aria-label="Copy to clipboard"` and
 * `<mwc-material-symbol>content_copy</mwc-material-symbol>`
 *
 * @fires {AsyncClickEvent<ClipboardData>} - Fired if the `value` is an empty
 * string which can be used to dynamically load the clipboard data as a string
 * or {@link ClipboardItems}. See the examples above for usage.
 * @fires {CustomEvent<ClipboardCopyEventDetail>} - Fired if the copy event was
 * successful. It will include the resolved clipboard data in the detail.
 * @fires {CustomEvent<ClipboardCopyErrorEventDetail>} - Fired if the copy
 * event failed. It will include the resolved clipboard data and the error in
 * the detail.
 */
export class CopyToClipboard
  extends LitElement
  implements CopyToClipboardProperties
{
  static override styles = styles;
  static readonly elementName: string = "mwc-copy-to-clipboard";

  @property()
  value = "";

  @property({ type: Boolean, attribute: "allow-empty" })
  allowEmpty = false;

  @property()
  position: CopyToClipboardPosition = "static";

  @property({ attribute: "anchor-x" })
  anchorX: HorizontalAnchor = "left";

  @property({ attribute: "anchor-y" })
  anchorY: VerticalAnchor = "center";

  @property({ type: Boolean })
  arrow = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ attribute: "hidden-media" })
  hiddenMedia: MediaQueryNameOrQuery | null = "phone";

  #pending = false;

  #hiddenMedia = new MediaQueryController({
    host: this,
    query: this.hiddenMedia,
  });

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("click", this.#handleClick);
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("hiddenMedia")) {
      this.#hiddenMedia.setQuery(this.hiddenMedia);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("click", this.#handleClick);
  }

  override render(): TemplateResult {
    return html`<slot ?hidden=${this.#hiddenMedia.matches} name="override">
      <mwc-tooltip
        anchor-x=${this.anchorX}
        anchor-y=${this.anchorY}
        ?popover-arrow=${this.arrow}
        ><slot name="tooltip" slot="tooltip">Copy to clipboard</slot
        ><span class="popover-target" slot="popover-target"
          ><slot name="button"
            ><mwc-icon-button
              aria-label="Copy to clipboard"
              .disabled=${this.disabled}
              slot="popover-target"
              ><mwc-material-symbol
                >content_copy</mwc-material-symbol
              ></mwc-icon-button
            ></slot
          ></span
        ></mwc-tooltip
      ></slot
    >`;
  }

  async #handleClick(): Promise<void> {
    if (this.disabled || this.#pending) {
      return;
    }

    try {
      this.#pending = true;
      await copyToClipboard({
        data: this.value || undefined,
        allowEmpty: this.allowEmpty,
        element: this,
      });
    } finally {
      this.#pending = false;
    }
  }
}
