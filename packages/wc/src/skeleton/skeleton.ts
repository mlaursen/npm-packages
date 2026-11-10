import { randomInt } from "@mlaursen/utils";
import {
  LitElement,
  html,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property } from "lit/decorators.js";

import { getVarName } from "../utils/tokens.js";
import styles from "./skeleton-styles.js";
import type {
  SkeletonProperties,
  SkeletonShape,
  SkeletonSize,
  SkeletonVariant,
} from "./types.js";

/**
 * Generates a skeleton animation.
 *
 * @example Simple Examples
```html
<mwc-skeleton></mwc-skeleton>

<!-- or based on content -->
<mwc-skeleton shape="circle" size="content">
  <mwc-avatar></mwc-avatar>
</mwc-skeleton>

<!-- or random width -->
<mwc-skeleton random-width>
</mwc-skeleton>
```
 *
 * The skeleton can also be toggled to show content once it has loaded.
 * @example Toggling
```html
<mwc-skeleton>
  <mwc-typography></mwc-typography>
</mwc-skeleton>

<script>
const skeleton = document.querySelector("mwc-skeleton");
const data = await loadSomeData();

skeleton.active = false;
skeleton.firstElementChild.append(
  ...data.map((item) => {
    // insert nodes into skeleton
    const p = document.createElement("p");
    p.append(document.createTextNode(item ?? ""));
    return p
  }),
);
</script>
```
 */
export class Skeleton extends LitElement implements SkeletonProperties {
  static override styles = styles;
  static readonly elementName: string = "mwc-skeleton";

  @property({ type: Boolean, reflect: true })
  active = true;

  @property({ reflect: true })
  size: SkeletonSize = "text";

  @property({ type: Boolean, attribute: "random-width" })
  randomWidth = false;

  @property({ type: Number, attribute: "min-percentage" })
  minPercentage: number = 40;

  @property({ type: Number, attribute: "max-percentage" })
  maxPercentage: number = 85;

  @property({ type: Boolean, attribute: "random-delay" })
  randomDelay = false;

  @property({ type: Number, attribute: "min-delay" })
  minDelay: number = 0;

  @property({ type: Number, attribute: "max-delay" })
  maxDelay: number = 400;

  @property({ reflect: true })
  shape: SkeletonShape = "round";

  @property({ reflect: true })
  variant: SkeletonVariant = "fade";

  #randomWidth: number | null = null;
  #randomDelay: number | null = null;

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("randomWidth")) {
      this.#updateRandomWidth();
    }

    if (changed.has("randomDelay")) {
      this.#updateRandomDelay();
    }
  }

  #updateRandomWidth(): void {
    const varName = getVarName("skeleton.width");
    if (!this.randomWidth) {
      if (this.#randomWidth !== null) {
        this.style.removeProperty(varName);
      }
      this.#randomWidth = null;
      return;
    }

    const width = randomInt({
      min: this.minPercentage,
      max: this.maxPercentage,
    });

    this.style.setProperty(varName, `${width}%`);
  }

  #updateRandomDelay(): void {
    const varName = getVarName("skeleton.animation.delay");
    if (!this.randomDelay) {
      if (this.#randomDelay !== null) {
        this.style.removeProperty(varName);
      }
      this.#randomDelay = null;
      return;
    }

    const delay = randomInt({ min: this.minDelay, max: this.maxDelay });

    this.style.setProperty(varName, `${delay}ms`);
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
