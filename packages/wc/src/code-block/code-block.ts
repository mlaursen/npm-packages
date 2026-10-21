import { LitElement, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import styles from "./code-block-styles.js";
import type { CodeBlockProperties } from "./types.js";

const BaseCodeBlock = MarginMixin(LitElement);

/**
 * The code block component can be used to render code blocks that have
 * scrollbars and sticky elements while scrolling. The default slot should
 * be a single `<code>` element that highlights code.
 *
 * @example PrismJS Highlight Example
```ts
<mwc-code-block>
  <code class="language-sh"><span class="token function">npm</span> <span class="token function">install</span> @mlaursen/wc</code>
</mwc-code-block>
```
 *
 * Since shiki requires additional styles and classes on the `<pre>` element,
 * use the `pre` slot instead of the default slot.
 *
 * @example Shiki Highlight Example
```ts
<mwc-code-block>
  <pre slot="pre" class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" dir="ltr"><code class="language-sh"><span class="line"><span style="color:#B392F0">npm</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> @mlaursen/wc</span></span></code></pre>
</mwc-code-block>
```
 *
 * @slot - The default slot is rendered in a `<pre>` element and should always
 * be a single `<code>` element with the code to display.
 * @slot sticky - An optional slot for elements that should be fixed within the
 * scroll container. These elements should be positioned with
 * `position: absolute`.
 * @slot after-pre - An optional slot for rendering content after the default
 * `<pre>` element
 * @slot pre-container - An optional slot to replace the default
 * `<div class="pre-container">` and all child slots.
 * @slot scroll-container - An optional slot to replace the default
 * `<div class="scroll-container-container">` and all child slots.
 */
export class CodeBlock extends BaseCodeBlock implements CodeBlockProperties {
  static override styles = [...BaseCodeBlock.styles, styles];
  static readonly elementName: string = "mwc-code-block";

  @property({ type: Boolean, attribute: "line-wrap" })
  lineWrap = false;

  override render(): TemplateResult {
    const preClass = classMap({
      wrap: this.lineWrap,
    });

    return html`
      <slot name="scroll-container">
        <div class="scroll-container">
          <slot name="pre-container">
            <div class="pre-container">
              <slot name="pre">
                <pre
                  class="pre${preClass}"
                ><slot @slotchange=${this.#removeTextNodes}></slot></pre>
              </slot>
              <slot name="after-pre"></slot>
            </div>
          </slot>
        </div>
      </slot>
      <span aria-hidden="true" class="state-layer"></span>
      <slot name="sticky"></slot>
    `;
  }

  /**
   * Text nodes need to be removed from this slot since the `<pre>` maintains
   * whitespace. Code formatters might add indentation when using the
   * `<mwc-code-block>` which would mess up styling. The default slot should
   * always be a single `<code>` element with correct whitespace.
   */
  #removeTextNodes(event: Event): void {
    const nodes = (event.target as HTMLSlotElement).assignedNodes();
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = null;
      }
    }
  }
}
