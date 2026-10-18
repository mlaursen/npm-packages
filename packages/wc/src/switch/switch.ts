import {
  LitElement,
  html,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, query } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import { FormValidationMixin } from "../form-validation/form-validation-mixin.js";
import { requiredValidator } from "../form-validation/required-validator.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./switch-styles.js";
import type { SwitchIcons, SwitchProperties, SwitchSize } from "./types.js";

const BaseStyledSwitch = InteractionMixin(
  PaletteMixin(MarginMixin(LitElement)),
);
const BaseSwitch = FormValidationMixin(AriaMixin(BaseStyledSwitch, "switch"), {
  updateInternalsAttributes: ["error", "checked", "required"],
});

const CHECKED = Symbol("checked");

/**
 * @example Simple Example
```html
<mwc-switch aria-label="Enable Wi-Fi"></mwc-switch>
```
 *
 * @slot handle-content - An optional slot to override the content within the
 * handle. When this is provided, it will prevent the `checked-icon` and
 * `unchecked-icon` slots from working.
 * @slot checked-icon - An optional slot that can be used to change the default
 * checked icon.
 * @slot unchecked-icon - An optional slot that can be used to change the default
 * checked icon.
 */
export class Switch extends BaseSwitch implements SwitchProperties {
  static override styles = [...BaseSwitch.styles, styles];
  static override formValidators = [requiredValidator];
  static readonly elementName: string = "mwc-switch";

  @property()
  size: SwitchSize = "medium";

  @property()
  icons: SwitchIcons = "never";

  @property({ type: Boolean })
  get checked(): boolean {
    return this[CHECKED];
  }
  set checked(checked: boolean) {
    const prevChecked = this.checked;
    if (prevChecked === checked) {
      return;
    }

    this[CHECKED] = checked;
    this.requestUpdate("checked", prevChecked);
  }

  [CHECKED] = false;

  @property()
  override value = "on";

  @query(".handle")
  _handle?: HTMLElement;

  #isSpaceClick = false;

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("checked")) {
      this.classList.toggle("checked", this.checked);
    }
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("checked")) {
      this.setValue(this.checked ? this.value : null);
    }
  }

  override render(): TemplateResult {
    return html`
      <span class="handle">
        <slot name="handle-content">
          <slot
            name="unchecked-icon"
            ?hidden=${this.checked || this.icons === "never" || this.icons === "checked"}
          >
            <mwc-material-symbol>close</mwc-material-symbol>
          </slot>
          <slot
            name="checked-icon"
            ?hidden=${!this.checked || this.icons === "never"}
          >
            <mwc-material-symbol>check</mwc-material-symbol>
          </slot>
        </slot>
        ${this._renderRipple()}
      </span>
      ${this._renderStateLayer()}
    `;
  }

  override handleClick(event: MouseEvent): void {
    super.handleClick(event);
    if (event.defaultPrevented) {
      return;
    }

    // need to prevent `<label>` elements re-dispatching the click event if
    // wrapped in a `<label>`
    if (event.isTrusted || this.#isSpaceClick) {
      this.#isSpaceClick = false;
      event.preventDefault();
    }

    this.checked = !this.checked;
    this.dispatchEvent(
      new Event("change", {
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new Event("input", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  override handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.internals?.form?.requestSubmit();
      return;
    }

    super.handleKeyDown(event);
  }

  override updateInternals(): void {
    this[CHECKED] = this.checked;

    this.internals.ariaChecked = `${this.checked}`;
    this.internals.ariaRequired = this.required ? "true" : null;
  }

  override _onFormReset = (): void => {
    const defaultChecked = this.hasAttribute("checked");

    this.checked = defaultChecked;
  };
}
