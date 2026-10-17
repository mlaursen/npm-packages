import { alphaNumericSort, chunk } from "@mlaursen/utils";
import { WindowVirtualizerController } from "@tanstack/lit-virtual";
import Fuse from "fuse.js";
import {
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";

import { categories, tags } from "../../../../_data/materialSymbols.js";
import {
  DEFAULT_HEADING_HEIGHT,
  FIRST_HEADING_HEIGHT,
  MIN_CELL_WIDTH,
  OTHER_HEADING_HEIGHT,
} from "./constants.js";

@customElement("virtual-list")
export class VirtualList extends LitElement {
  #containerRef = createRef<HTMLDivElement>();
  #windowController: WindowVirtualizerController<Element>;
  #observer: ResizeObserver;

  #fuse = this.#createFuse();
  #available = this.#getAvailableSymbols();

  static override styles = css`
    .container {
      height: var(--height);
      position: relative;
    }

    .row {
      left: 0;
      position: absolute;
      top: 0;
      transform: translateY(var(--position));
    }

    .grid {
      grid-auto-rows: 8rem;
    }

    .symbol {
      --mwc-icon-size: 2rem;

      gap: var(--mwc-spacing-large);
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
  `;

  @property()
  query: string = "";

  @property({ type: Boolean, attribute: "filters-visible" })
  filtersVisible = false;

  @property()
  selected = "";

  @state()
  _columns = 8;

  #createFuse(): Fuse<{ name: string; categories: string[] }> {
    const taggedSymbols = Object.entries(tags).map(([name, categories]) => ({
      name,
      categories,
    }));
    return new Fuse(taggedSymbols, {
      keys: [
        { name: "name", weight: 0.8 },
        { name: "categories", weight: 0.2 },
      ],
      threshold: 0.3,
    });
  }

  #getAvailableSymbols(): (string | string[])[] {
    const available: (string | string[])[] = [];
    if (this.query) {
      const results = chunk(this.#fuse.search(this.query), this._columns);
      for (const items of results) {
        available.push(items.map(({ item }) => item.name));
      }
    } else {
      const sorted = alphaNumericSort(Object.entries(categories), {
        extractor: (item) => item[0],
      });
      for (const [category, icons] of sorted) {
        available.push(category, ...chunk(icons, this._columns));
      }
    }

    return available;
  }

  #estimateSize = (i: number): number => {
    const match = this.#available[i];
    if (typeof match === "string") {
      return i === 0 ? 48 : 80;
    }

    return MIN_CELL_WIDTH;
  };

  #renderMatch(match: string | string[], i: number): TemplateResult {
    if (typeof match === "string") {
      const height = i === 0 ? FIRST_HEADING_HEIGHT : OTHER_HEADING_HEIGHT;
      const margin = height - DEFAULT_HEADING_HEIGHT;
      return html`<mwc-typography
        variant="title"
        size="small"
        margin="none"
        style="margin-top: ${margin}px"
      >
        <h3>${match}</h3>
      </mwc-typography>`;
    }

    return html`${repeat(
      match,
      (name) => html`
        <mwc-button
          aria-pressed=${this.selected === name}
          variant=${this.selected === name ? "tonal" : "text"}
          class="symbol"
          shape="square"
          @click=${() => {
            this.dispatchEvent(
              new CustomEvent("selected", {
                detail: { icon: name },
                bubbles: true,
                composed: true,
              }),
            );
          }}
        >
          <mwc-material-symbol>${name}</mwc-material-symbol>
          <mwc-typography text-transform="capitalize" text-align="center">
            <span>${name.replaceAll("_", " ")}</span>
          </mwc-typography>
        </mwc-button>
      `,
    )}`;
  }

  constructor() {
    super();

    this.#windowController = new WindowVirtualizerController(this, {
      count: this.#available.length,
      overscan: 5,
      estimateSize: this.#estimateSize,
    });

    let frame = 0;
    const update = ([entry]: ResizeObserverEntry[]): void => {
      globalThis.cancelAnimationFrame(frame);
      if (!entry) {
        return;
      }

      frame = globalThis.requestAnimationFrame(() => {
        this._columns = Math.floor(entry.contentRect.width / MIN_CELL_WIDTH);
      });
    };

    this.#observer = new ResizeObserver(update);
  }

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("_columns") || changed.has("query")) {
      this.#available = this.#getAvailableSymbols();
      const virtualizer = this.#windowController.getVirtualizer();
      virtualizer.setOptions({
        ...virtualizer.options,
        count: this.#available.length,
      });
    }
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (changed.has("_columns") && this.selected) {
      const i = this.#getAvailableSymbols().findIndex((match) =>
        typeof match === "string"
          ? match === this.selected
          : match.includes(this.selected),
      );
      const virtualizer = this.#windowController.getVirtualizer();
      virtualizer.scrollToIndex(i, {
        align: "center",
      });
    }
  }

  override firstUpdated(changed: PropertyValues): void {
    super.firstUpdated(changed);

    const container = this.#containerRef.value;
    if (!container) {
      return;
    }

    this.#observer.observe(container);
  }

  override render(): TemplateResult {
    const virtualizer = this.#windowController.getVirtualizer();
    const measure = (node: Element | null = null): void =>
      virtualizer.measureElement(node);

    return html`
      <div
        ${ref(this.#containerRef)}
        class="container"
        style="--height: ${virtualizer.getTotalSize()}px; --mwc-box-columns: ${this._columns};"
      >
        ${repeat(
          virtualizer.getVirtualItems(),
          (row) => row.key,
          (row) => {
            const match = this.#available[row.index];
            if (!match) {
              return;
            }
            const isCategory = typeof match === "string";

            return html`
              <mwc-box
                ${ref(measure)}
                class="row ${classMap({ grid: !isCategory })}"
                style="--position: ${row.start - virtualizer.options.scrollMargin}px;"
                align=${ifDefined(isCategory ? undefined : "stretch")}
                ?grid=${!isCategory}
                full-width
                padding=${isCategory ? "inline" : "all"}
                >${this.#renderMatch(match, row.index)}</mwc-box
              >
            `;
          },
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "virtual-list": VirtualList;
  }
}
