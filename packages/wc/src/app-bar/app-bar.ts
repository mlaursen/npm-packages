import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import "../app-bar-title/app-bar-title.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./app-bar-styles.js";
import {
  type AppBarPosition,
  type AppBarProperties,
  type AppBarScrollBehavior,
  type AppBarSize,
  type AppBarTitlePosition,
  type AppBarVariant,
} from "./types.js";

const BaseAppBar = PaletteMixin(LitElement);

/**
 * This example will use an app bar stuck to the top of the page with
 * `position: sticky` and show box-shadow once the user has scrolled the page:
 * @example Full Example
 * ```ts
 * <mwc-app-bar>
 *   <mwc-icon-button slot="nav">
 *     <mwc-material-symbol>menu</mwc-material-symbol>
 *   </mwc-icon-button>
 *
 *   <!-- any element can be used with `slot="title"` -->
 *   <div slot="title">Main Title</div>
 *
 *   <!-- 0 to many actions that will be pushed to the end using `slot="actions"` -->
 *   <mwc-icon-button slot="actions">
 *     <mwc-material-symbol>
 *       search
 *     </mwc-material-symbol>
 *   </mwc-icon-button>
 *   <mwc-icon-button slot="actions">
 *     <mwc-material-symbol>
 *       calendar_month
 *     </mwc-material-symbol>
 *   </mwc-icon-button>
 * </mwc-app-bar>
 * ```
 *
 * This example shows how you can just render a static toolbar without any positioning
 * within the viewport and disabling the default layout behavior:
 * @example Static Example
 * ```ts
 * <mwc-app-bar scroll-behavior="static" variant="custom">
 *   <mwc-app-bar-title>App Bar Title</mwc-app-bar-title>
 * </mwc-app-bar>
 * ```
 */
@customElement("mwc-app-bar")
export class AppBar extends BaseAppBar implements AppBarProperties {
  static override styles = [...BaseAppBar.styles, styles];

  @property({ reflect: true })
  size: AppBarSize = "small";

  @property({ reflect: true })
  variant: AppBarVariant = "flexible";

  @property({ reflect: true })
  position: AppBarPosition = "top";

  @property({ reflect: true, attribute: "scroll-behavior" })
  scrollBehavior: AppBarScrollBehavior = "sticky";

  @property({ type: Boolean, reflect: true })
  scrolled?: boolean;

  @property({ type: Boolean })
  subtitle?: boolean;

  @property({ type: Boolean, attribute: "disable-title" })
  disableTitle?: boolean;

  @property({ attribute: "title-position" })
  titlePosition?: AppBarTitlePosition;

  @property({ type: Boolean, attribute: "disable-actions" })
  disableActions?: boolean;

  @property({ type: Boolean, attribute: "disable-elevation" })
  disableElevation?: boolean;

  #observer?: IntersectionObserver;
  #scrollSentinel?: HTMLDivElement;

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#observer?.disconnect();
    this.#scrollSentinel?.remove();
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has("scrollBehavior")) {
      this.#updateScrollObserver();
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.#renderElevation()}
      <slot name="nav"></slot>
      <slot name="search"></slot>
      ${this.#renderTitle()} ${this.#renderActions()}
      <slot></slot>
    `;
  }

  #updateScrollObserver(): void {
    if (!this.parentNode || this.scrollBehavior === "static") {
      this.#observer?.disconnect();
      this.#scrollSentinel?.remove();
      return;
    }

    this.#scrollSentinel ??= document.createElement("div");
    this.parentNode.insertBefore(this.#scrollSentinel, this);
    this.#observer = new IntersectionObserver(([entry]) => {
      this.scrolled = !(entry?.isIntersecting ?? true);
    });
    this.#observer.observe(this.#scrollSentinel);
  }

  #renderElevation(): TemplateResult | null {
    if (this.scrollBehavior === "static" || this.disableElevation) {
      return null;
    }

    return html`<mwc-elevation></mwc-elevation>`;
  }

  #renderTitle(): TemplateResult | null {
    if (this.disableTitle || this.variant === "custom") {
      return null;
    }

    return html`
      <slot name="title-container">
        <mwc-app-bar-title
          size=${this.size}
          position=${ifDefined(this.titlePosition)}
          ?subtitle=${this.subtitle}
        >
          <slot name="title"></slot>
          <slot slot="subtitle" name="subtitle"></slot>
        </mwc-app-bar-title>
      </slot>
    `;
  }

  #renderActions(): TemplateResult | null {
    if (this.disableActions) {
      return null;
    }

    return html`
      <slot name="actions-container">
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-app-bar": AppBar;
  }
}
