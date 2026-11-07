import { debounce, titleCase } from "@mlaursen/utils";
import type {
  DialogBackdropVariant,
  MaterialSymbolCustomPropertyName,
} from "@mlaursen/wc";
import {
  getVar,
  getVarName,
  isCustomElement,
  isMaterialSymbolFamily,
  isMaterialSymbolGrade,
  isMaterialSymbolOpticalSize,
  isMaterialSymbolWeight,
  MATERIAL_SYMBOL_GRADES,
  MATERIAL_SYMBOL_OPTICAL_SIZES,
  MediaQueryController,
  Radio,
  TextField,
  toggleMaterialSymbolVar,
  URLSearchParamsController,
} from "@mlaursen/wc";
import type { PropertyValues, TemplateResult } from "lit";
import { html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

import { families } from "../../../../_data/materialSymbols.js";
import {
  SYMBOL_CUSTOM_PROPERTY_NAMES,
  SYMBOL_QUERY_STATE_PARAMS,
} from "./constants.js";
import { materialSymbolsDefaults, materialSymbolsSchema } from "./schema.js";
import type { MaterialSymbolsState } from "./types.js";
import type { VirtualList } from "./virtual-list.js";

import styles from "./material-symbols-virtualizer.scss";

@customElement("material-symbols-virtualizer")
export class MaterialSymbolsVirtualizer
  extends LitElement
  implements MaterialSymbolsState
{
  @query("virtual-list")
  _list?: VirtualList;

  #phone = new MediaQueryController({ host: this, query: "phone" });
  #desktop = new MediaQueryController({ host: this, query: "desktop" });

  static override styles = styles;
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  #searchParams = new URLSearchParamsController(this, {
    schema: materialSymbolsSchema,
    omitDefaults: true,
  });

  @state()
  query = this.#searchParams.get("q");

  @state()
  filtersVisible =
    !this.#searchParams.get("icon") || globalThis.innerWidth > 1200;

  @state()
  selected = this.#searchParams.get("icon");

  @state()
  fill = this.#searchParams.get("FILL");

  @state()
  grade = this.#searchParams.get("GRAD");

  @state()
  weight = this.#searchParams.get("wght");

  @state()
  opsz = this.#searchParams.get("opsz");

  @state()
  family = this.#searchParams.get("family");

  #lastPanelOpened: "filters" | "selected" | null = null;

  #handleSearchInput(event: InputEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    this.#setQuery(target.value.trim());
  }

  #setQuery = debounce((query: string): void => {
    this.query = query;
  }, 150);

  override willUpdate(changed: PropertyValues): void {
    if (changed.has("filtersVisible") || changed.has("selected")) {
      const isFiltersVisible = changed.has("filtersVisible");
      const entering = isFiltersVisible ? this.filtersVisible : !!this.selected;

      this.#setTransition(entering);

      this.#lastPanelOpened = null;
      if (entering) {
        this.#lastPanelOpened = isFiltersVisible ? "filters" : "selected";
      }
    }

    if (
      this.#lastPanelOpened &&
      !this.#desktop.matches &&
      this.filtersVisible &&
      this.selected
    ) {
      if (this.#lastPanelOpened === "filters") {
        this.selected = "";
      } else {
        this.filtersVisible = false;
      }
    }
  }

  override updated(changed: PropertyValues): void {
    if (SYMBOL_QUERY_STATE_PARAMS.some((key) => changed.has(key))) {
      this.#searchParams.update({
        q: this.query,
        FILL: this.fill,
        GRAD: this.grade,
        wght: this.weight,
        opsz: this.opsz,
        family: this.family,
        icon: this.selected,
      });
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
    this.fill = materialSymbolsDefaults.FILL;
    this.weight = materialSymbolsDefaults.wght;
    this.grade = materialSymbolsDefaults.GRAD;
    this.opsz = materialSymbolsDefaults.opsz;
    this.family = materialSymbolsDefaults.family;
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

    const grade = MATERIAL_SYMBOL_GRADES[input.valueAsNumber];
    if (isMaterialSymbolGrade(grade)) {
      this.grade = grade;
    }
  }

  #handleOpszChange(event: InputEvent): void {
    const input = event.currentTarget;
    if (!isCustomElement(input, TextField)) {
      return;
    }

    const opsz = MATERIAL_SYMBOL_OPTICAL_SIZES[input.valueAsNumber];
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

  #setTransition(entering: boolean): void {
    const duration = entering
      ? getVar("duration.long-2")
      : getVar("duration.short-3");
    const easing = entering
      ? getVar("easing.emphasized")
      : getVar("easing.emphasized-accelerate");
    this.style.setProperty("--duration", duration);
    this.style.setProperty("--easing", easing);
  }

  #updateSize(panel: "selected" | "filters", visible: boolean): void {
    if (visible) {
      this.style.setProperty(
        `--${panel}-desktop-visible-size`,
        `var(--${panel}-panel-size)`,
      );
    } else {
      this.style.removeProperty(`--${panel}-desktop-visible-size`);
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

  #getBackdrop(): DialogBackdropVariant {
    return this.#phone.matches ? "visible" : "disabled";
  }

  override render(): TemplateResult {
    return html`
      ${this.#renderAppBar()}${this.#renderFiltersPanel()}
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
      this.fill !== materialSymbolsDefaults.FILL ||
      this.weight !== materialSymbolsDefaults.wght ||
      this.grade !== materialSymbolsDefaults.GRAD ||
      this.opsz !== materialSymbolsDefaults.opsz ||
      this.family !== materialSymbolsDefaults.family;

    // NOTE: need to swap out the text fields for sliders once I create them
    return html`
      <mwc-sheet
        style="--mwc-sheet-header-padding-block-end: 0"
        class="filters-panel"
        type="fixed"
        position="left"
        backdrop=${this.#getBackdrop()}
        disable-focus-trap
        disable-scroll-lock
        ?open=${this.filtersVisible}
        @close=${() => {
          // need this for when the built-in close button is clicked
          this.#setTransition(false);
          this.#updateSize("filters", false);
        }}
        @closed=${() => {
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
              .value=${`${MATERIAL_SYMBOL_GRADES.indexOf(this.grade)}`}
              @change=${this.#handleGradeChange}
            >
              <span slot="label">Grade (${this.grade})</span>
            </mwc-text-field>
            <mwc-text-field
              type="number"
              name="opsz"
              min="0"
              max="3"
              .value=${`${MATERIAL_SYMBOL_OPTICAL_SIZES.indexOf(this.opsz)}`}
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
      class="selected-panel"
      type="fixed"
      position="right"
      backdrop=${this.#getBackdrop()}
      disable-focus-trap
      disable-scroll-lock
      ?open=${!!this.selected}
      @close=${() => {
        // need this for when the built-in close button is clicked
        this.#setTransition(false);
        this.#updateSize("selected", false);
      }}
      @closed=${() => {
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
