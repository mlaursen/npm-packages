import type { CSSResultArray, PropertyValues, TemplateResult } from "lit";
import { html } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { AnimateMixin } from "../transition/animate-mixin.js";
import type {
  AnimateOptions,
  AnimationList,
  GetAnimationMap,
} from "../transition/types.js";
import type {
  StylableLitElement,
  StyledLitElementWithProperties,
} from "../types.js";
import { isSlotted } from "../utils/slots.js";
import {
  DEFAULT_HIDE_POPOVER_ANIMATION,
  DEFAULT_SHOW_POPOVER_ANIMATION,
} from "./constants.js";
import popoverStyles from "./popover-styles.js";
import type {
  AnimatePopoverElementMap,
  HorizontalAnchor,
  PopoverInitiator,
  PopoverInitiatorAction,
  PopoverProperties,
  PopoverType,
  RenderPopoverTargetOptions,
  VerticalAnchor,
} from "./types.js";

/**
 * This mixin allows other elements to support the popover api if a
 * `popoverBehavior` property exists. It is generally recommended to use this
 * alongside the `MarginMixin` so that wrapping the popover targets can still
 * have general margin and spacing applied.
 */
export function PopoverMixin<T extends StylableLitElement>(
  Base: T,
): StyledLitElementWithProperties<PopoverProperties, T> {
  let styles: CSSResultArray = [popoverStyles];
  if (Base.styles) {
    const baseStyles = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    styles = [...baseStyles, popoverStyles];
  }

  class PopoverElement extends AnimateMixin(Base) implements PopoverProperties {
    static override styles = styles;

    @property({ attribute: "anchor-x" })
    anchorX: HorizontalAnchor = "center";

    @property({ attribute: "anchor-y" })
    anchorY: VerticalAnchor = "below";

    @property({ reflect: true, attribute: "popover-type" })
    popoverType?: PopoverType;

    @property({ attribute: "popover-initiator" })
    popoverInitiator: PopoverInitiator = "all";

    @property({ type: Number, attribute: "show-delay" })
    showDelay?: number;

    @property({ type: Number, attribute: "hide-delay" })
    hideDelay?: number;

    @property({ type: Number, attribute: "hover-delay" })
    hoverDelay?: number;

    @property({ type: Number, attribute: "focus-delay" })
    focusDelay?: number;

    @query(".popover")
    _popover?: HTMLSpanElement;

    @query(".popover-content")
    _popoverContent?: HTMLDivElement;

    @query("slot[name=popover-target]")
    _popoverTarget?: HTMLSlotElement;

    @state()
    _hasPopoverTarget = false;

    getShowPopoverAnimation: GetAnimationMap<AnimatePopoverElementMap> = () =>
      DEFAULT_SHOW_POPOVER_ANIMATION;
    getHidePopoverAnimation: GetAnimationMap<AnimatePopoverElementMap> = () =>
      DEFAULT_HIDE_POPOVER_ANIMATION;

    #timeout: ReturnType<typeof globalThis.setTimeout> | undefined;
    #initiator: PopoverInitiatorAction | null = null;
    #closing = false;

    override firstUpdated(): void {
      this.#bindPopoverHandlers(true);
    }

    protected override willUpdate(changed: PropertyValues): void {
      super.willUpdate(changed);

      if (!changed.has("_hasPopoverTarget")) {
        return;
      }

      this.#bindTargetHandlers(this._hasPopoverTarget);
    }

    override updated(changed: PropertyValues): void {
      super.updated(changed);

      if (
        !changed.has("popoverType") &&
        !changed.has("popoverInitiator") &&
        !changed.has("anchorX") &&
        !changed.has("anchorY")
      ) {
        return;
      }

      // only reflect the popover attributes if popoverType was defined. This
      // helps for the `dialog` component which can opt-in to the popover API
      if (this.hasAttribute("popover-type")) {
        this.setAttribute("popover-initiator", this.popoverInitiator);
        this.setAttribute("anchor-x", this.anchorX);
        this.setAttribute("anchor-y", this.anchorY);
      } else {
        this.removeAttribute("popover-initiator");
        this.removeAttribute("anchor-x");
        this.removeAttribute("anchor-y");
      }
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.#bindPopoverHandlers(false);
      this.#bindTargetHandlers(false);
      this.#clearTimeout();
    }

    renderPopoverTarget(target?: TemplateResult): TemplateResult {
      return html`
        <slot
          name="popover-target"
          @slotchange=${this.#handlePopoverTargetSlotChange}
        >
          ${target}
        </slot>
      `;
    }

    renderPopover(options: RenderPopoverTargetOptions): TemplateResult {
      const { target, content } = options;
      return html`
        ${this.renderPopoverTarget(target)}
        <div
          class="popover popover-surface"
          popover=${ifDefined(this.popoverType)}
        >
          <div class="popover-content">${content}</div>
        </div>
      `;
    }

    override _getAnimations(options: AnimateOptions): AnimationList {
      const { animate = true, opening } = options;
      if (!animate) {
        return [];
      }

      const getDefault = opening
        ? this.getShowPopoverAnimation
        : this.getHidePopoverAnimation;
      const { popover, content } = animate === true ? getDefault() : animate();

      return [
        [this._popover, popover],
        [this._popoverContent, content],
      ];
    }

    override _showElement(): void {
      this._popover?.showPopover();
    }

    override _closeElement(): void {
      this._popover?.hidePopover();
    }

    override showPopover(): void {
      this.show();
    }

    override hidePopover(): void {
      this.close();
    }

    override _onBeforeClose(): void {
      this.#closing = true;
    }

    #bindPopoverHandlers(add: boolean): void {
      const popover = this._popover;
      if (!popover) {
        return;
      }

      if (add) {
        popover.addEventListener("toggle", this.#handleToggle);
        popover.addEventListener("beforetoggle", this.#handleBeforeToggle);
      } else {
        popover.removeEventListener("toggle", this.#handleToggle);
        popover.removeEventListener("beforetoggle", this.#handleBeforeToggle);
      }
    }

    #bindTargetHandlers(add: boolean): void {
      const name = add ? "addEventListener" : "removeEventListener";

      this[name]("mouseenter", this.#handleMouseEnter);
      this[name]("mouseleave", this.#handleMouseLeave);
      this[name]("focus", this.#handleFocus, true);
      this[name]("blur", this.#handleBlur, true);
      this._popoverTarget?.[name]("click", this.#handlePopoverTargetClick);
    }

    #isInitiatorPrevented = (
      initiator: Exclude<PopoverInitiatorAction, "force">,
    ): boolean => {
      switch (this.popoverInitiator) {
        case "all":
          return false;
        case "focus":
          return initiator !== "focus";
        case "hover":
          return initiator !== "hover";
        case "click":
          return initiator !== "click";
        case "no-click":
          return initiator === "click";
        case "no-focus":
          return initiator === "focus";
        case "no-hover":
          return initiator === "hover";
        default:
          // shouldn't be possible
          return true;
      }
    };

    #handleToggle = (event: ToggleEvent): void => {
      if (event.newState === "closed") {
        this.#closing = false;
        this.#initiator = null;
        this.#clearTimeout();
      }
    };

    #handleBeforeToggle = (event: ToggleEvent): void => {
      // If the `popoverType` is set to `"hint"` and the browser closes the
      // popover due to one of the other interactions, the normal close
      // animation would not occur so capture that flow and animate.
      if (event.newState === "closed" && !this.#closing) {
        this.#closing = true;
        this.close();
      }
    };

    #clearTimeout(): void {
      globalThis.clearTimeout(this.#timeout);
    }

    #showPopover(initiator: PopoverInitiatorAction): void {
      if (!this.popoverType) {
        return;
      }

      if (initiator === "force") {
        this.#initiator = initiator;
        this.#clearTimeout();
        this.showPopover();
        return;
      }

      if (this.#initiator || this.#isInitiatorPrevented(initiator)) {
        return;
      }

      let delay = this.showDelay ?? 0;
      if (initiator === "focus" && typeof this.focusDelay === "number") {
        delay = this.focusDelay;
      } else if (initiator === "hover" && typeof this.hoverDelay === "number") {
        delay = this.hoverDelay;
      }

      delay = Math.max(0, delay);

      this.#initiator = initiator;
      this.#clearTimeout();
      this.#timeout = globalThis.setTimeout(() => {
        this.showPopover();
      }, delay);
    }

    #hidePopover(initiator: PopoverInitiatorAction): void {
      if (!this.popoverType) {
        return;
      }

      if (initiator === "force") {
        this.hidePopover();
        return;
      }

      if (this.#initiator !== initiator) {
        return;
      }

      this.#clearTimeout();
      this.#timeout = globalThis.setTimeout(
        () => {
          this.hidePopover();
        },
        Math.max(this.hideDelay ?? 0),
      );
    }

    #handleMouseEnter(): void {
      this.#showPopover("hover");
    }

    #handleMouseLeave(): void {
      this.#hidePopover("hover");
    }

    #handleFocus(event: Event): void {
      // only show when the user is focusing via keyboard
      if (
        event.target instanceof HTMLElement &&
        event.target.matches(":focus-visible")
      ) {
        this.#showPopover("focus");
      }
    }

    #handleBlur(event: Event): void {
      // allow the popover to gain focus without closing
      if (event.target instanceof HTMLElement && this.contains(event.target)) {
        return;
      }

      this.#hidePopover("focus");
    }

    #handlePopoverTargetSlotChange(event: Event): void {
      this._hasPopoverTarget = isSlotted(event);
    }

    #handlePopoverTargetClick = (event: Event): void => {
      const eventTarget = event.target;
      if (
        this.#isInitiatorPrevented("click") ||
        !this._popoverTarget ||
        !this._hasPopoverTarget ||
        !(eventTarget instanceof Node)
      ) {
        return;
      }

      const elements = this._popoverTarget.assignedElements();
      if (!elements.some((element) => element.contains(eventTarget))) {
        return;
      }

      if (this.#initiator) {
        this.#hidePopover("click");
      } else {
        this.#showPopover("click");
      }
    };
  }

  return PopoverElement;
}
