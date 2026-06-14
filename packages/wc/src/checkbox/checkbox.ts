import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import { BaseAnimateMixin } from "../transition/base-animate-mixin.js";
import {
  type AnimationList,
  type BaseAnimateOptions,
  type GetAnimationMap,
} from "../transition/types.js";
import styles from "./checkbox-styles.js";
import {
  DEFAULT_CHECKBOX_CHECKED_ANIMATION,
  DEFAULT_CHECKBOX_INDETERMINATE_ANIMATION,
  DEFAULT_CHECKBOX_UNCHECKED_ANIMATION,
} from "./constants.js";
import {
  type AnimateCheckboxElementMap,
  type CheckboxProperties,
  type CheckboxSize,
} from "./types.js";

const BaseStyledCheckbox = BaseAnimateMixin(
  InteractionMixin(PaletteMixin(MarginMixin(LitElement))),
);
const BaseCheckbox = AriaMixin(BaseStyledCheckbox, "checkbox");

@customElement("mwc-checkbox")
export class Checkbox extends BaseCheckbox implements CheckboxProperties {
  static override styles = [...BaseCheckbox.styles, styles];

  @property()
  size: CheckboxSize = "medium";

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  @query(".icon")
  _icon?: HTMLElement;

  @query(".background")
  _background?: HTMLElement;

  @query(".outline")
  _outline?: HTMLElement;

  @query(".mark.short")
  _shortMark?: HTMLElement;

  @query(".mark.long")
  _longMark?: HTMLElement;

  getCheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap> = () =>
    DEFAULT_CHECKBOX_CHECKED_ANIMATION;
  getUncheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap> = () =>
    DEFAULT_CHECKBOX_UNCHECKED_ANIMATION;
  getIndeterminateAnimation: GetAnimationMap<AnimateCheckboxElementMap> = () =>
    DEFAULT_CHECKBOX_INDETERMINATE_ANIMATION;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#updateInternals();
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (
      this._initialized &&
      (changed.has("checked") || changed.has("indeterminate"))
    ) {
      this._animate({});
    }
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("checked")) {
      this.#updateInternals();
    }
  }

  override render(): TemplateResult {
    // just so I remember this, when `stroke-width` is applied to svgs, it will
    // always be so that half of it extends past where it starts. so:
    // at 0, 0 with stroke-width 2px and an svg at 0 0 18 18
    // it will really have a size of 20x20
    return html`
      <slot name="icon">
        <svg aria-hidden class="icon" viewBox="0 0 18 18">
          <rect
            x="1"
            y="1"
            height="16"
            width="16"
            stroke-width="2"
            class="outline"
          />
          <rect class="background" />
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </slot>
      ${this.renderRipple()}
    `;
  }

  override _getAnimations(options: BaseAnimateOptions): AnimationList {
    const { animate = true } = options;
    if (!animate) {
      return [];
    }

    let getDefault = this.getUncheckedAnimation;
    if (this.indeterminate) {
      getDefault = this.getIndeterminateAnimation;
    } else if (this.checked) {
      getDefault = this.getCheckedAnimation;
    }

    const { icon, background, outline, shortMark, longMark } =
      animate === true ? getDefault() : animate();

    return [
      [this._icon, icon],
      [this._background, background],
      [this._outline, outline],
      [this._shortMark, shortMark],
      [this._longMark, longMark],
    ];
  }

  override handleClick(event: MouseEvent): void {
    super.handleClick(event);
    if (event.defaultPrevented) {
      return;
    }

    if (this.indeterminate) {
      this.checked = true;
      this.indeterminate = false;
    } else {
      this.checked = !this.checked;
    }

    this.dispatchEvent(
      new Event("change", {
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

  #updateInternals(): void {
    if (!this.internals) {
      return;
    }

    this.internals.ariaChecked = this.indeterminate
      ? "mixed"
      : `${this.checked}`;
    this.internals.ariaRequired = this.required ? "true" : null;
    this.internals.setFormValue(this.checked ? "on" : null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-checkbox": Checkbox;
  }
}
