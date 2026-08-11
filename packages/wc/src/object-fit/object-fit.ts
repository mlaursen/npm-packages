import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./object-fit-styles.js";
import type { ObjectFitVariant } from "./types.js";

@customElement("mwc-object-fit")
export class ObjectFit extends LitElement {
  static override styles = styles;

  /**
   * Setting this to `true` will ignore the `variant` attribute and behave as
   * `"scale-down"`. This really just allows for the scaled down version to be
   * placed at different edges of a flex/grid container instead of being forced
   * within the center.
   *
   * ```
   * scale down
   * -----------
   * |         |
   * |   xxx   |
   * |         |
   * -----------
   *
   * inline
   * -----------
   * |   xxx   |
   * |         |
   * |         |
   * -----------
   *
   * scale down (inside display: flex; align-items: flex-start; justify-content: flex-end)
   * -----------
   * |         |
   * |   xxx   |
   * |         |
   * -----------
   *
   * inline (inside display: flex; align-items: flex-start; justify-content: flex-end)
   * -----------
   * |         |
   * |         |
   * |xxx      |
   * -----------
   * ```
   *
   * @defaultValue `false`
   */
  @property({ type: Boolean })
  inline = false;

  /**
   * This sets the `object-fit` property allowing the content to be resized to
   * fit its container.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit}
   * @defaultValue `"contain"`
   */
  @property()
  variant: ObjectFitVariant = "contain";

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-object-fit": ObjectFit;
  }
}
