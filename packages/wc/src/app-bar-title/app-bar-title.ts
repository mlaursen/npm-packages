import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

import type { AppBarSize, AppBarTitlePosition } from "../app-bar/types.js";
import type { TypographySize, TypographyVariant } from "../typography/types.js";
import styles from "./app-bar-title-styles.js";
import type { AppBarTitleProperties } from "./types.js";

/**
 * This component should generally be used with the `mwc-app-bar` as it is just
 * a single wrapper around the typography styles for alignment within the app
 * bar.
 *
 * @example Simple Example
```html
<mwc-app-bar>
  <mwc-app-bar-title>App Bar Title</mwc-app-bar-title>
</mwc-app-bar>
```
 *
 * @slot - The default slot for the app bar title content body. This is
 * rendered within the `<mwc-typography>` element with `size` and `variant`
 * applied.
 * @slot subtitle - An optional slot used to render a subtitle below the main
 * slot content. This is rendered within the `<mwc-typography>` element with
 * the `size`, `variant`, and `color="on-surface-variant"` applied.
 */
export class AppBarTitle extends LitElement implements AppBarTitleProperties {
  static override styles = styles;

  @property()
  size: AppBarSize = "small";

  @property({ type: Boolean })
  subtitle?: boolean;

  @property()
  position: AppBarTitlePosition = "start";

  override render(): TemplateResult {
    let size: TypographySize = "large";
    let variant: TypographyVariant = "title";
    if (this.size === "medium") {
      size = "medium";
      variant = "headline";
    } else if (this.size === "large") {
      size = "small";
      variant = "display";
    }

    return html`
      <mwc-typography size=${size} variant=${variant}>
        <slot></slot>
      </mwc-typography>
      ${this.#renderSubtitle()}
    `;
  }

  #renderSubtitle(): TemplateResult | null {
    if (!this.subtitle) {
      return null;
    }

    let size: TypographySize = "medium";
    let variant: TypographyVariant = "label";
    if (this.size === "medium") {
      size = "small";
      variant = "title";
    } else if (this.size === "large") {
      size = "medium";
      variant = "title";
    }

    return html`
      <mwc-typography
        color="on-surface-variant"
        size=${size}
        variant=${variant}
      >
        <slot name="subtitle"></slot>
      </mwc-typography>
    `;
  }
}
