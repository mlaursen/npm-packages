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

const CHECKED = Symbol("checked");
const INDETERMINATE = Symbol("indeterminate");

@customElement("mwc-checkbox")
export class Checkbox extends BaseCheckbox implements CheckboxProperties {
  static override styles = [...BaseCheckbox.styles, styles];

  @property()
  size: CheckboxSize = "medium";

  @property({ type: Boolean })
  error = false;

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

  @property({ type: Boolean })
  get indeterminate(): boolean {
    return this[INDETERMINATE];
  }
  set indeterminate(indeterminate: boolean) {
    const prevIndeterminate = this.indeterminate;
    if (prevIndeterminate === indeterminate) {
      return;
    }

    this[INDETERMINATE] = indeterminate;
    this.requestUpdate("indeterminate", prevIndeterminate);
  }

  [INDETERMINATE] = false;

  @property({ type: Boolean })
  required = false;

  @property()
  value = "on";

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

  #reset = false;

  getCheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap> = () =>
    DEFAULT_CHECKBOX_CHECKED_ANIMATION;
  getUncheckedAnimation: GetAnimationMap<AnimateCheckboxElementMap> = () =>
    DEFAULT_CHECKBOX_UNCHECKED_ANIMATION;
  getIndeterminateAnimation: GetAnimationMap<AnimateCheckboxElementMap> = () =>
    DEFAULT_CHECKBOX_INDETERMINATE_ANIMATION;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#updateInternals();
    this.internals?.form?.addEventListener("reset", this.#handleReset);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.internals?.form?.removeEventListener("reset", this.#handleReset);
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("checked") || changed.has("indeterminate")) {
      this.classList.toggle("checked", this.checked);
      this.classList.toggle("indeterminate", this.indeterminate);
      this._animate({ animate: this._initialized && !this.#reset });
      this.#reset = false;
    }
    if (
      changed.has("error") ||
      changed.has("checked") ||
      changed.has("required") ||
      changed.has("indeterminate")
    ) {
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
      ${this.renderStateLayer()} ${this.renderRipple()}
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

  #updateInternals(): void {
    this[CHECKED] = this.checked;
    if (!this.internals) {
      return;
    }

    this.internals.ariaChecked = this.indeterminate
      ? "mixed"
      : `${this.checked}`;
    this.internals.ariaRequired = this.required ? "true" : null;
    this.internals.ariaInvalid = this.error ? "true" : null;
    this.internals.setFormValue(this.checked ? this.value : null);

    if (!this.checked && this.required) {
      this.internals.setValidity(
        { valueMissing: true },
        "Please select an option.",
        this,
      );
    } else {
      this.internals.setValidity();
    }
  }

  #handleReset = (): void => {
    const defaultChecked = this.hasAttribute("checked");
    const defaultIndeterminate = this.hasAttribute("indeterminate");

    this.#reset =
      this.checked !== defaultChecked ||
      this.indeterminate !== defaultIndeterminate;
    this.checked = defaultChecked;
    this.indeterminate = defaultIndeterminate;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-checkbox": Checkbox;
  }
}
