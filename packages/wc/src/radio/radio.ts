import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  isServer,
} from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import { FormControlMixin } from "../form-control/form-control-mixin.js";
import { requiredValidator } from "../form-control/required-validator.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import { BaseAnimateMixin } from "../transition/base-animate-mixin.js";
import type {
  AnimationList,
  BaseAnimateOptions,
  GetAnimationMap,
} from "../transition/types.js";
import {
  DEFAULT_RADIO_CHECKED_ANIMATION,
  DEFAULT_RADIO_UNCHECKED_ANIMATION,
} from "./constants.js";
import styles from "./radio-styles.js";
import type {
  AnimateRadioElementMap,
  RadioProperties,
  RadioSize,
} from "./types.js";

const BaseStyledRadio = BaseAnimateMixin(
  InteractionMixin(PaletteMixin(MarginMixin(LitElement))),
);
const BaseRadio = FormControlMixin(AriaMixin(BaseStyledRadio, "radio"), {
  updateInternalsAttributes: ["error", "checked", "required"],
});

const CHECKED = Symbol("checked");

/**
 * The `mwc-radio` component needs to be used with the `mwc-radio-group` for
 * full functionality.
 *
 * @example Main Example
 * ```ts
 * <mwc-radio-group aria-label="Fruits">
 *   <mwc-typography variant="label"><label for="radio-1">Apple</label></mwc-typography>
 *   <mwc-radio id="radio-1" name="fruits" value="apple" checked></mwc-radio>
 *   <mwc-typography variant="label"><label for="radio-2">Banana</label></mwc-typography>
 *   <mwc-radio id="radio-2" name="fruits" value="banana"></mwc-radio>
 *   <mwc-typography variant="label"><label for="radio-3">Clementine</label></mwc-typography>
 *   <mwc-radio id="radio-3" name="fruits" value="clementine"></mwc-radio>
 * </mwc-radio-group>
 * ```
 */
@customElement("mwc-radio")
export class Radio extends BaseRadio implements RadioProperties {
  static override styles = [...BaseRadio.styles, styles];
  static override formControlValidators = [requiredValidator];

  @property()
  size: RadioSize = "medium";

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

  @query(".icon")
  _icon?: HTMLElement;

  @query(".outline")
  _outline?: HTMLElement;

  @query(".mark")
  _mark?: HTMLElement;

  getCheckedAnimation: GetAnimationMap<AnimateRadioElementMap> = () =>
    DEFAULT_RADIO_CHECKED_ANIMATION;
  getUncheckedAnimation: GetAnimationMap<AnimateRadioElementMap> = () =>
    DEFAULT_RADIO_UNCHECKED_ANIMATION;

  #reset = false;

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (isServer) {
      return;
    }

    if (changed.has("checked")) {
      this.classList.toggle("checked", this.checked);
      this._animate({ animate: this._initialized && !this.#reset });
      this.#reset = false;
    }
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("checked")) {
      this.setValue(this.checked ? this.value : null);
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="icon">
        <svg aria-hidden class="icon" viewBox="0 0 20 20">
          <mask id="cutout">
            <rect width="100%" height="100%" fill="white" />
            <circle cx="10" cy="10" r="8" fill="black" />
          </mask>
          <circle class="outline" cx="10" cy="10" r="10" mask="url(#cutout)" />
          <circle class="mark" cx="10" cy="10" r="5" />
        </svg>
      </slot>
      ${this._renderStateLayer()} ${this._renderRipple()}
    `;
  }

  override _getAnimations(options: BaseAnimateOptions): AnimationList {
    const { animate = true } = options;
    if (!animate) {
      return [];
    }

    const getDefault = this.checked
      ? this.getCheckedAnimation
      : this.getUncheckedAnimation;

    const { icon, mark, outline } = animate === true ? getDefault() : animate();

    return [
      [this._icon, icon],
      [this._mark, mark],
      [this._outline, outline],
    ];
  }

  override handleClick(event: MouseEvent): void {
    super.handleClick(event);
    if (event.defaultPrevented) {
      return;
    }

    this.checked = true;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    this.dispatchEvent(
      new Event("input", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  override handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.internals.form?.requestSubmit();
      return;
    }

    super.handleKeyDown(event);
  }

  override updateInternals(): void {
    this.internals.ariaChecked = `${this.checked}`;
    this.internals.ariaRequired = this.required ? "true" : null;
  }

  override resetFormControl = (): void => {
    const defaultChecked = this.hasAttribute("checked");
    this.#reset = this.checked !== defaultChecked;
    this.checked = defaultChecked;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-radio": Radio;
  }
}
