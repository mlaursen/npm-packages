import { LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { InternalsMixin } from "../internals-mixin/internals-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { getPercentage } from "../utils/getPercentage.js";
import styles from "./progress-styles.js";
import type { ProgressProperties, ProgressVariant } from "./types.js";

// NOTE: do not use the `AriaMixin` since this does not require the disabled states
const BaseProgress = InternalsMixin(LitElement);
const BaseStyledProgress = MarginMixin(BaseProgress);

/**
 * This is an internal class that is used for the `LinearProgress` and
 * `CircularProgress` components.
 */
export class Progress extends BaseStyledProgress implements ProgressProperties {
  static override styles = [...BaseStyledProgress.styles, styles];

  @property({ reflect: true })
  override role = "progressbar" as const;

  @property()
  variant: ProgressVariant = "primary";

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 100;

  @property({ type: Number })
  value = this.min;

  @property({ type: Number })
  buffer = this.min;

  @property({ type: Boolean, attribute: "disable-gap" })
  disableGap = false;

  @property({ type: Boolean, attribute: "disable-transition" })
  disableTransition = false;

  @property({ type: Boolean })
  paused = false;

  @property({ type: Boolean })
  reversed = false;

  /**
   * Helper getter to determine if the progressbar is in an indeterminate state
   *
   * @returns `true` if there is no `value` attribute
   */
  get indeterminate(): boolean {
    return !this.hasAttribute("value");
  }

  constructor() {
    super();

    this.internals.role = "progressbar";
    this.#updateInternals();
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("min") || changed.has("max") || changed.has("value")) {
      this.#updateInternals();
      this.#updatePercentage();
    }
  }

  #updateInternals(): void {
    this.internals.ariaValueMin = `${this.min}`;
    this.internals.ariaValueMax = `${this.max}`;
    this.internals.ariaValueNow = this.indeterminate ? null : `${this.value}`;
  }

  #updatePercentage(): void {
    const valueVar = "--_v";
    if (this.indeterminate) {
      this.style.removeProperty(valueVar);
      return;
    }

    const percentage = getPercentage({
      min: this.min,
      max: this.max,
      value: this.value,
    });
    const value = percentage * 100;

    this.style.setProperty(valueVar, `${value}`);
  }
}
