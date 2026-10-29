import { html, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { Button } from "../button/button.js";
import type { ProgressVariant } from "../progress/types.js";
import { AsyncClickEvent } from "../utils/async-click-event.js";
import styles from "./async-button-styles.js";
import type {
  AsyncButtonDisabledVariant,
  AsyncButtonProperties,
  AsyncButtonVariant,
} from "./types.js";

/**
 * The `AsyncButton` will display a progress bar while the `pending` attribute exists:
 *
 * @example Default Example
```html
<mwc-async-button pending>Button</mwc-async-button>
```
 *
 * If the button should also display an icon, use the `"start"` and/or `"end"`
 * to provide the correct gap:
 *
 * @example Addon Example
```html
<mwc-async-button pending>
<mwc-material-symbol slot="start">favorite</mwc-material-symbolL>
<mwc-material-symbol slot="end">close</mwc-material-symbolL>
Button
</mwc-async-button>
```
 *
 * The `pending` state can also automatically be updated by adding an event
 * listener for the `"async-click"` type:
 *
 * @example Async Event Example
```html
<mwc-async-button>Button</mwc-async-button>

<script>
async function load() {
  // do stuff
  return wait(4000);
}

const button = document.querySelector("mwc-async-button");
button.addEventListener("async-click", (event) => {
  event.waitUntil(load());
});
</script>
```
 * @slot - The default slot for the content to display. Unlike the base button,
 * there will not be gap applied between items.
 * @slot start - An optional slot that can place content at the start of the
 * button with gap.
 * @slot end - An optional slot that can place content at the end of the button
 * with gap.
 * @slot linear - An optional slot to override the linear progress bar.
 * @slot circular - An optional slot to override the circular progress bar.
 *
 * @fires {AsyncEvent} async-click - Fired on click to automatically toggle the
 * `pending` state while waiting for the promises to resolve. Add promise to
 * the `event.waitUntil()`.
 */
export class AsyncButton extends Button implements AsyncButtonProperties {
  static override styles = [...Button.styles, styles];
  static override readonly elementName: string = "mwc-async-button";

  @property({ type: Boolean, reflect: true })
  pending = false;

  @property({ attribute: "async-variant", reflect: true })
  asyncVariant: AsyncButtonVariant = "circular-overlay";

  @property({ attribute: "async-disabled-variant" })
  asyncDisabledVariant: AsyncButtonDisabledVariant = null;

  @property({ attribute: "progress-label" })
  progressLabel = "Loading";

  @property({ attribute: "progress-variant" })
  progressVariant?: ProgressVariant;

  #setAriaDisabled = false;
  #setDisabled = false;

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("pending") || changed.has("asyncDisabledVariant")) {
      const state = this.pending ? "true" : null;
      this.ariaBusy = state;

      if (this.#setDisabled && this.asyncDisabledVariant !== "disabled") {
        this.#setDisabled = false;
        this.removeAttribute("disabled");
      }

      if (
        this.#setAriaDisabled &&
        this.asyncDisabledVariant !== "aria-disabled"
      ) {
        this.#setAriaDisabled = false;
        this.ariaDisabled = null;
      }

      if (this.asyncDisabledVariant === "aria-disabled") {
        this.ariaDisabled = state;
        this.#setAriaDisabled = this.pending;
      } else if (this.asyncDisabledVariant === "disabled") {
        this.#setDisabled = this.pending;
        this.toggleAttribute("disabled", this.pending);
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="start"></slot>
      <span class="progress">
        <slot name="circular">
          <mwc-circular-progress
            aria-label=${this.progressLabel}
            variant=${ifDefined(this.progressVariant)}
          ></mwc-circular-progress>
        </slot>
        <slot name="linear">
          <mwc-linear-progress
            aria-label=${this.progressLabel}
            variant=${ifDefined(this.progressVariant)}
          ></mwc-linear-progress>
        </slot>
      </span>
      <span class="content"><slot></slot></span>
      <slot name="end"></slot>
      ${this._renderStateLayer()}
    `;
  }

  override isDisabled(): boolean {
    return super.isDisabled() || this.pending;
  }

  override async handleClick(event: MouseEvent): Promise<void> {
    if (this.pending) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    super.handleClick(event);
    if (event.defaultPrevented) {
      return;
    }

    const asyncEvent = new AsyncClickEvent({ bubbles: true, composed: true });
    this.dispatchEvent(asyncEvent);
    if (asyncEvent.promises.length === 0) {
      return;
    }

    this.pending = true;
    try {
      await Promise.all(asyncEvent.promises);
    } catch {
      // silently reject. should be handled by the consumer
    } finally {
      this.pending = false;
    }
  }
}
