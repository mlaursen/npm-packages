import { spread } from "@open-wc/lit-helpers";
import { LitElement, html, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { InteractionMixin } from "../interaction/interaction-mixin.js";
import type { InteractionDirection } from "../interaction/types.js";
import { InternalsMixin } from "../internals-mixin/internals-mixin.js";
import { PASS_THROUGH_LINK_PROPS } from "../link/constants.js";
import { isSlotted } from "../utils/slots.js";
import styles from "./list-item-styles.js";
import type { ListItemProperties } from "./types.js";

const BaseListItem = InteractionMixin(InternalsMixin(LitElement), true);

/**
 * The `ListItem` should not be used directly. Use the `ListItemButton`,
 * `ListItemLink`, or `ListItemText` implementations instead.
 */
export class ListItem extends BaseListItem implements ListItemProperties {
  static override styles = [...BaseListItem.styles, styles];

  override interaction: InteractionDirection = "inward";

  @property({ type: Boolean })
  selected?: boolean;

  @property()
  rel?: string;

  @property()
  href: string = "";

  @property()
  hreflang?: string;

  @property()
  target?: string;

  @property()
  download?: string;

  @property()
  referrerPolicy?: string;

  @property()
  ping?: string;

  @property()
  type?: string;

  @state()
  _hasStartIcon = false;

  @state()
  _hasStartAvatar = false;

  @state()
  _hasStartImage = false;

  @state()
  _hasStartVideo = false;

  @state()
  _hasEndIcon = false;

  @state()
  _hasEndAvatar = false;

  @state()
  _hasEndImage = false;

  @state()
  _hasEndVideo = false;

  constructor() {
    super();

    this.internals.role = "listitem";
  }

  override render(): TemplateResult {
    if (this.href) {
      return this.#renderLink();
    }

    return this.#renderButton();
  }

  #renderSlots(): TemplateResult {
    const startHidden =
      !this._hasStartIcon &&
      !this._hasStartAvatar &&
      !this._hasStartImage &&
      !this._hasStartVideo;
    const endHidden =
      !this._hasEndIcon &&
      !this._hasEndAvatar &&
      !this._hasEndImage &&
      !this._hasEndVideo;
    return html`
      <slot name="start" class="start" ?hidden=${startHidden}>
        <slot
          name="start-icon"
          @slotchange=${this.#handleSlotChange}
          ?hidden=${!this._hasStartIcon}
        ></slot>
        <slot
          name="start-avatar"
          @slotchange=${this.#handleSlotChange}
          ?hidden=${!this._hasStartAvatar}
        ></slot>
        <slot
          class="image"
          name="start-image"
          ?hidden=${!this._hasStartImage}
          @slotchange=${this.#handleSlotChange}
        ></slot>
        <slot
          class="video"
          name="start-video"
          ?hidden=${!this._hasStartVideo}
          @slotchange=${this.#handleSlotChange}
        ></slot>
      </slot>
      <div class="main"><slot></slot></div>
      <slot name="end" class="end" ?hidden=${endHidden}>
        <slot
          name="end-icon"
          @slotchange=${this.#handleSlotChange}
          ?hidden=${!this._hasEndIcon}
        ></slot>
        <slot
          name="end-avatar"
          @slotchange=${this.#handleSlotChange}
          ?hidden=${!this._hasEndAvatar}
        ></slot>
        <slot
          class="image"
          name="end-image"
          ?hidden=${!this._hasEndImage}
          @slotchange=${this.#handleSlotChange}
        ></slot>
        <slot
          class="video"
          name="end-video"
          ?hidden=${!this._hasEndVideo}
          @slotchange=${this.#handleSlotChange}
        ></slot>
      </slot>
    `;
  }

  #renderStateLayer(): TemplateResult {
    return html`${this._renderStateLayer()} ${this._renderRipple()}`;
  }

  #renderLink(): TemplateResult {
    const props: Partial<HTMLAnchorElement> = {};
    for (const name of PASS_THROUGH_LINK_PROPS) {
      props[name] = this[name];
    }

    return html`
      <a
        ${spread(props)}
        class="state-layer-target"
        @focus=${this._updateFocusVisible}
        @blur=${this._updateFocusVisible}
      >
        ${this.#renderSlots()}${this.#renderStateLayer()}
      </a>
    `;
  }

  #renderButton(): TemplateResult {
    let tabIndex = 0;
    let ariaDisabled: "true" | undefined;
    let ariaSelected: "true" | "false" | undefined;
    if (this.disabled) {
      ariaDisabled = "true";
      tabIndex = -1;
    }

    if (this.selected !== undefined) {
      ariaSelected = this.selected ? "true" : "false";
    }

    return html`
      <div
        aria-disabled=${ifDefined(ariaDisabled)}
        aria-selected=${ifDefined(ariaSelected)}
        role="button"
        class="state-layer-target"
        tabindex=${tabIndex}
        @click=${this.#handleButtonClick}
        @keydown=${this.#handleButtonKeyDown}
        @focus=${this._updateFocusVisible}
        @blur=${this._updateFocusVisible}
      >
        ${this.#renderSlots()}${this.#renderStateLayer()}
      </div>
    `;
  }

  #handleButtonClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  #handleButtonKeyDown(event: KeyboardEvent): void {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    // do not scroll the page
    if (event.key === " ") {
      event.preventDefault();
    }

    // since I won't remember this, for some reason `this.click()` won't work
    // like how it did for React so a new event must be dispatched.
    this.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  #handleSlotChange(event: Event): void {
    const slotName = (event.currentTarget as HTMLSlotElement).name ?? "";
    let name:
      | "_hasStartIcon"
      | "_hasStartAvatar"
      | "_hasStartImage"
      | "_hasStartVideo"
      | "_hasEndIcon"
      | "_hasEndAvatar"
      | "_hasEndImage"
      | "_hasEndVideo";
    switch (slotName) {
      case "start-icon":
        name = "_hasStartIcon";
        break;
      case "start-avatar":
        name = "_hasStartAvatar";
        break;
      case "start-image":
        name = "_hasStartImage";
        break;
      case "start-videp":
        name = "_hasStartVideo";
        break;
      case "end-icon":
        name = "_hasEndIcon";
        break;
      case "end-avatar":
        name = "_hasEndAvatar";
        break;
      case "end-image":
        name = "_hasEndImage";
        break;
      case "end-videp":
        name = "_hasEndVideo";
        break;
      default:
        return;
    }

    const slotted = isSlotted(event);
    this[name] = slotted;
  }
}
