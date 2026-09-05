import type { PropertyValues, TemplateResult } from "lit";
import { LitElement, html, isServer } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import boxStyles from "./box-styles.js";
import type {
  BoxAlignItems,
  BoxGap,
  BoxGrid,
  BoxJustifyContent,
  BoxPadding,
  BoxProperties,
} from "./types.js";

const BaseBox = PaletteMixin(MarginMixin(LitElement));

/**
 * This example uses the box to add default padding and spacing around the four
 * items in a flex layout with `align-items: center`:
 *
 * @example Simple Flex Layout
```html
<mwc-box>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</mwc-box>
```
 *
 * This example just shows some of the flex layout configuration available by
 * removing the padding and gap, stacking items, and stretching content.
 *
 * @example Simple Flex Layout
```html
<mwc-box align="stretch" justify="stretch" stacked padding="none" gap="none">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</mwc-box>
```
 *
 * This example uses the box to add default padding and spacing around the four items
 * in a grid layout that uses `auto-fit` behavior by default:
 *
 * @example Simple Grid Layout
```html
<mwc-box grid>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</mwc-box>
```
 *
 * @slot - The default slot for the content body.
 */
@customElement("mwc-box")
export class Box extends BaseBox implements BoxProperties {
  static override styles = [...BaseBox.styles, boxStyles];

  @property()
  align?: BoxAlignItems;

  @property()
  justify?: BoxJustifyContent;

  @property({ type: Boolean })
  inline = false;

  @property({ reflect: false })
  grid: BoxGrid = false;

  @property({ type: Boolean, attribute: "full-width" })
  fullWidth?: boolean;

  @property({ type: Boolean, reflect: true })
  stacked?: boolean;

  @property({ type: Boolean })
  reversed?: boolean;

  @property({ reflect: true })
  gap: BoxGap = "all";

  @property({ type: Boolean })
  nowrap?: boolean;

  @property({ reflect: true })
  padding: BoxPadding = "all";

  override connectedCallback(): void {
    super.connectedCallback();

    this.#updateGridColumns();
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (isServer) {
      return;
    }

    if (changed.has("grid")) {
      this.#updateGridColumns();
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  #updateGridColumns(): void {
    const property = "--mwc-box-columns";
    if (typeof this.grid === "string" && /^\d+$/.test(this.grid)) {
      this.style.setProperty(property, this.grid);
    } else {
      this.style.removeProperty(property);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-box": Box;
  }
}
