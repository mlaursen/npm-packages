import { debounce, titleCase } from "@mlaursen/utils";
import {
  isCustomElement,
  isMaterialSymbolFamily,
  isMaterialSymbolGrade,
  isMaterialSymbolOpticalSize,
  isMaterialSymbolWeight,
  Radio,
  TextField,
  toggleMaterialSymbolVar,
  type MaterialSymbolCustomPropertyName,
  type MaterialSymbolGrade,
  type MaterialSymbolOpticalSize,
} from "@mlaursen/wc";
import {
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

import { families } from "../../../../_data/materialSymbols.js";
import {
  SYMBOL_CUSTOM_PROPERTY_NAMES,
  SYMBOL_QUERY_STATE_DEFAULTS,
  SYMBOL_QUERY_STATE_PARAMS,
} from "./constants.js";
import type { MaterialSymbolsState } from "./types.js";
import { URLSearchParamsController } from "./URLSearchParamsController.js";
import { getSearchParamsUpdate, getSearchParamsValue } from "./utils.js";
import type { VirtualList } from "./virtual-list.js";

const GRADES = [-25, 0, 200] as const satisfies MaterialSymbolGrade[];
const OPSZS = [20, 24, 40, 48] as const satisfies MaterialSymbolOpticalSize[];

@customElement("material-symbols-virtualizer")
export class MaterialSymbolsVirtualizer
  extends LitElement
  implements MaterialSymbolsState
{
  @query("virtual-list")
  _list?: VirtualList;

  static override styles = css`
    :host {
      --filters-panel-size: 20rem;
      --filters-visible-size: 0px;
      --selected-panel-size: 20rem;
      --selected-visible-size: 0px;
      --app-bar-size: 4rem;
      --mwc-sheet-fixed-top: calc(var(--app-bar-size) * 2);

      display: grid;
      grid-template-columns: var(--filters-visible-size) minmax(0, 1fr) var(
          --selected-visible-size
        );
      grid-template-rows: var(--app-bar-size) 1fr;
      min-height: 100dvh;

      transition: grid-template-columns
        var(--duration, var(--mwc-duration-long-2))
        var(--easing, var(--mwc-easing-emphasized));
    }

    .search-container {
      grid-column: 1/-1;
      grid-row: 1;
      display: flex;
      padding-inline: var(--mwc-spacing-large);
      top: var(--app-bar-size);
    }

    .search {
      --mwc-text-field-shape-all: var(--mwc-shape-corner-full);
      width: 100%;
    }

    .filters-panel {
      --mwc-dialog-width: var(--filters-visible-size);
    }

    .selected-panel {
      --mwc-dialog-width: var(--selected-visible-size);
    }

    virtual-list {
      grid-column: 2;
      grid-row: 2;
    }
  `;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  #urlController = new URLSearchParamsController(this);

  @state()
  query = getSearchParamsValue("query", this.#urlController);

  @state()
  filtersVisible =
    !this.#urlController.get("icon") || globalThis.innerWidth > 1200;

  @state()
  selected = getSearchParamsValue("selected", this.#urlController);

  @state()
  fill = getSearchParamsValue("fill", this.#urlController);

  @state()
  grade = getSearchParamsValue("grade", this.#urlController);

  @state()
  weight = getSearchParamsValue("weight", this.#urlController);

  @state()
  opsz = getSearchParamsValue("opsz", this.#urlController);

  @state()
  family = getSearchParamsValue("family", this.#urlController);

  #handleSearchInput(event: InputEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    this.#setQuery(target.value.trim());
  }

  #setQuery = debounce((query: string): void => {
    this.query = query;
  }, 150);

  override willUpdate(changed: PropertyValues): void {
    if (changed.has("filtersVisible")) {
      this.style.setProperty(
        "--duration",
        this.filtersVisible
          ? "var(--mwc-duration-long-2)"
          : "var(--mwc-duration-short-3)",
      );
      this.style.setProperty(
        "--easing",
        this.filtersVisible
          ? "var(--mwc-easing-emphasized)"
          : "var(--mwc-easing-emphasized-accelerate)",
      );
    }
  }

  override updated(changed: PropertyValues): void {
    if (SYMBOL_QUERY_STATE_PARAMS.some((key) => changed.has(key))) {
      this.#urlController.update(
        getSearchParamsUpdate({
          query: this.query,
          fill: this.fill,
          weight: this.weight,
          grade: this.grade,
          opsz: this.opsz,
          family: this.family,
          selected: this.selected,
        }),
      );
    }

    if (changed.has("filtersVisible")) {
      this.#updateSize("filters", this.filtersVisible);
    }

    if (changed.has("selected")) {
      this.#updateSize("selected", !!this.selected);
    }

    for (const name of SYMBOL_CUSTOM_PROPERTY_NAMES) {
      this.#updateProperty(name, changed);
    }
  }

  #toggleFiltersVisible(): void {
    this.filtersVisible = !this.filtersVisible;
  }

  #handleSelected(event: CustomEvent<{ icon: string }>): void {
    this.selected = event.detail.icon;
  }

  #reset(): void {
    this.fill = SYMBOL_QUERY_STATE_DEFAULTS.fill;
    this.weight = SYMBOL_QUERY_STATE_DEFAULTS.weight;
    this.grade = SYMBOL_QUERY_STATE_DEFAULTS.grade;
    this.opsz = SYMBOL_QUERY_STATE_DEFAULTS.opsz;
    this.family = SYMBOL_QUERY_STATE_DEFAULTS.family;
  }

  #toggleFill(): void {
    this.fill = this.fill === 1 ? 0 : 1;
  }

  #handleWeightChange(event: InputEvent): void {
    const input = event.currentTarget;
    if (!isCustomElement(input, TextField)) {
      return;
    }

    if (!isMaterialSymbolWeight(input.valueAsNumber)) {
      return;
    }

    this.weight = input.valueAsNumber;
  }

  #handleGradeChange(event: InputEvent): void {
    const input = event.currentTarget;
    if (!isCustomElement(input, TextField)) {
      return;
    }

    const grade = GRADES[input.valueAsNumber];
    if (isMaterialSymbolGrade(grade)) {
      this.grade = grade;
    }
  }

  #handleOpszChange(event: InputEvent): void {
    const input = event.currentTarget;
    if (!isCustomElement(input, TextField)) {
      return;
    }

    const opsz = OPSZS[input.valueAsNumber];
    if (isMaterialSymbolOpticalSize(opsz)) {
      this.opsz = opsz;
    }
  }

  #handleFamilyChange(event: InputEvent): void {
    if (
      !isCustomElement(event.currentTarget, Radio) ||
      !isMaterialSymbolFamily(event.currentTarget.value)
    ) {
      return;
    }

    this.family = event.currentTarget.value;
  }

  #updateSize(panel: "selected" | "filters", visible: boolean): void {
    if (visible) {
      this.style.setProperty(
        `--${panel}-visible-size`,
        `var(--${panel}-panel-size)`,
      );
    } else {
      this.style.removeProperty(`--${panel}-visible-size`);
    }
  }

  #updateProperty(
    name: MaterialSymbolCustomPropertyName,
    changed: PropertyValues,
  ): void {
    if (!changed.has(name) || !this._list) {
      return;
    }

    toggleMaterialSymbolVar({
      root: this._list,
      name,
      value: this[name],
    });
  }

  override render(): TemplateResult {
    return html`
      ${this.#renderAppBar()} ${this.#renderFiltersPanel()}
      <virtual-list
        query=${this.query}
        ?filters-visible=${this.filtersVisible}
        @selected=${this.#handleSelected}
        selected=${this.selected}
      ></virtual-list>
      ${this.#renderSelectedPanel()}
    `;
  }

  #renderAppBar(): TemplateResult {
    return html`
      <mwc-app-bar class="search-container" custom="search">
        <mwc-button
          slot="nav"
          variant="outlined"
          aria-pressed=${this.filtersVisible}
          @click=${this.#toggleFiltersVisible}
        >
          <mwc-material-symbol style="--mwc-icon-symbol-weight: 200" opsz="48">
            ${this.filtersVisible ? "close" : "tune"}
          </mwc-material-symbol>
          Filters
        </mwc-button>
        <mwc-text-field
          slot="search"
          class="search"
          size="small"
          placeholder="Search icons"
          @input=${this.#handleSearchInput}
          value=${this.query}
        ></mwc-text-field>
      </mwc-app-bar>
    `;
  }

  #renderFiltersPanel(): TemplateResult {
    const isCustomized =
      this.fill !== SYMBOL_QUERY_STATE_DEFAULTS.fill ||
      this.weight !== SYMBOL_QUERY_STATE_DEFAULTS.weight ||
      this.grade !== SYMBOL_QUERY_STATE_DEFAULTS.grade ||
      this.opsz !== SYMBOL_QUERY_STATE_DEFAULTS.opsz ||
      this.family !== SYMBOL_QUERY_STATE_DEFAULTS.family;

    // NOTE: need to swap out the text fields for sliders once I create them
    return html`
      <mwc-sheet
        style="--mwc-sheet-header-padding-block-end: 0"
        disable-focus-trap
        class="filters-panel"
        position="left"
        type="fixed"
        ?open=${this.filtersVisible}
        @close=${() => {
          this.filtersVisible = false;
        }}
        close-button
      >
        <mwc-button
          slot="header"
          variant="text"
          margin="end"
          @click=${this.#reset}
          .disabled=${!isCustomized}
        >
          <mwc-material-symbol>refresh</mwc-material-symbol>
          Reset All
        </mwc-button>
        <div slot="dialog-content">
          <mwc-box align="stretch" stacked>
            <mwc-typography variant="title" margin="none">
              <h3>Customization</h3>
            </mwc-typography>
            <mwc-typography variant="label">
              <label>
                <mwc-box inline padding="none">
                  <mwc-checkbox
                    name="fill"
                    @change=${this.#toggleFill}
                    ?checked=${this.fill === 1}
                  >
                  </mwc-checkbox>
                  Fill
                </mwc-box>
              </label>
            </mwc-typography>

            <mwc-text-field
              type="number"
              name="weight"
              step="100"
              min="100"
              max="700"
              .value=${`${this.weight}`}
              @change=${this.#handleWeightChange}
            >
              <span slot="label">Weight</span>
            </mwc-text-field>
            <mwc-text-field
              type="number"
              name="grade"
              min="0"
              max="2"
              .value=${`${GRADES.indexOf(this.grade)}`}
              @change=${this.#handleGradeChange}
            >
              <span slot="label">Grade (${this.grade})</span>
            </mwc-text-field>
            <mwc-text-field
              type="number"
              name="opsz"
              min="0"
              max="3"
              .value=${`${OPSZS.indexOf(this.opsz)}`}
              @change=${this.#handleOpszChange}
            >
              <span slot="label">Optical Size (${this.opsz}px)</span>
            </mwc-text-field>

            <mwc-typography
              >Check out the
              <mwc-link href="https://fonts.google.com/icons"
                >official material symbols website</mwc-link
              >
              for more information.</mwc-typography
            >
          </mwc-box>
          <mwc-divider></mwc-divider>
          <mwc-box align="stretch" stacked>
            <mwc-typography variant="title" margin="none">
              <h3>Filter</h3>
            </mwc-typography>

            <mwc-radio-group>
              ${map(families, (familyTitle) => {
                const family = familyTitle.toLowerCase();
                return html`
                  <mwc-typography variant="label">
                    <label>
                      <mwc-box padding="none">
                        <mwc-radio
                          name="family"
                          value=${family}
                          required
                          .checked=${this.family === family}
                          @change=${this.#handleFamilyChange}
                        ></mwc-radio>
                        ${familyTitle}
                      </mwc-box>
                    </label>
                  </mwc-typography>
                `;
              })}
            </mwc-radio-group>
          </mwc-box>
        </div>
      </mwc-sheet>
    `;
  }

  #renderSelectedPanel(): TemplateResult {
    // I need a way to add text-transform to the sheet title or render a custom <mwc-sheet-title>
    const title = titleCase(this.selected.replaceAll("_", " "), " ");
    return html`<mwc-sheet
      disable-focus-trap
      class="selected-panel"
      position="right"
      type="fixed"
      ?open=${!!this.selected}
      @close=${() => {
        this.selected = "";
      }}
      close-button
    >
      <h3 slot="title">${title}</h3>
    </mwc-sheet>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "material-symbols-virtualizer": MaterialSymbolsVirtualizer;
  }
}
