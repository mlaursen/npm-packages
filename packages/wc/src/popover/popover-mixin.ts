import { type CSSResultArray, type TemplateResult, html } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { AnimateMixin } from "../transition/animate-mixin.js";
import type {
  AnimateOptions,
  AnimationList,
  GetAnimationMap,
} from "../transition/types.js";
import {
  type StylableLitElement,
  type StyledLitElementWithProperties,
} from "../types.js";
import {
  DEFAULT_HIDE_POPOVER_ANIMATION,
  DEFAULT_SHOW_POPOVER_ANIMATION,
} from "./constants.js";
import popoverStyles from "./popover-styles.js";
import {
  type AnimatePopoverElementMap,
  type HorizontalPosition,
  type PopoverBehavior,
  type PopoverInitiator,
  type PopoverProperties,
  type RenderPopoverTargetOptions,
  type VerticalPosition,
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
    styles = [popoverStyles, ...baseStyles];
  }

  class PopoverElement extends AnimateMixin(Base) implements PopoverProperties {
    static override styles = styles;

    @property({ reflect: true, attribute: "anchor-x" })
    anchorX: HorizontalPosition = "center";

    @property({ reflect: true, attribute: "anchor-y" })
    anchorY: VerticalPosition = "below";

    @property({ reflect: true, attribute: "popover-behavior" })
    popoverBehavior?: PopoverBehavior;

    @property({ type: Number, attribute: "show-delay" })
    showDelay?: number;

    @property({ type: Number, attribute: "hide-delay" })
    hideDelay?: number;

    @property({ type: Number, attribute: "hover-delay" })
    hoverDelay?: number;

    @property({ type: Number, attribute: "focus-delay" })
    focusDelay?: number;

    @property({ type: Boolean, attribute: "disable-focus" })
    disableFocus?: boolean;

    @property({ type: Boolean, attribute: "disable-hover" })
    disableHover?: boolean;

    @query("#popover")
    _popover?: HTMLSpanElement;

    @query("slot[name=target]")
    _target?: HTMLSlotElement;

    getShowPopoverAnimation: GetAnimationMap<AnimatePopoverElementMap> = () =>
      DEFAULT_SHOW_POPOVER_ANIMATION;
    getHidePopoverAnimation: GetAnimationMap<AnimatePopoverElementMap> = () =>
      DEFAULT_HIDE_POPOVER_ANIMATION;

    #timeout: ReturnType<typeof globalThis.setTimeout> | undefined;
    #initiator: PopoverInitiator | null = null;

    protected override firstUpdated(): void {
      this._popover?.addEventListener("toggle", this.#handleToggle);
    }

    override connectedCallback(): void {
      super.connectedCallback();

      this.addEventListener("mouseenter", this.#handleMouseEnter);
      this.addEventListener("mouseleave", this.#handleMouseLeave);
      this.addEventListener("focus", this.#handleFocus, true);
      this.addEventListener("blur", this.#handleBlur, true);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.removeEventListener("mouseenter", this.#handleMouseEnter);
      this.removeEventListener("mouseleave", this.#handleMouseLeave);
      this.removeEventListener("focus", this.#handleFocus, true);
      this.removeEventListener("blur", this.#handleBlur, true);

      this._popover?.removeEventListener("toggle", this.#handleToggle);
      this.#clearTimeout();
    }

    renderPopoverTarget(options: RenderPopoverTargetOptions): TemplateResult {
      const { target, content } = options;
      return html`
        <slot name="popover-target">${target}</slot>
        <div id="popover" popover=${ifDefined(this.popoverBehavior)}>
          <div id="popover-content">${content}</div>
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
      const { popover, target } = animate === true ? getDefault() : animate();

      return [
        [this._popover, popover],
        [this._target, target],
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

    #handleToggle = (event: ToggleEvent): void => {
      if (event.newState === "closed") {
        this.#initiator = null;
        this.#clearTimeout();
      }
    };

    #clearTimeout(): void {
      globalThis.clearTimeout(this.#timeout);
    }

    #showPopover(initiator: PopoverInitiator): void {
      if (!this.popoverBehavior) {
        return;
      }

      if (initiator === "force") {
        this.#initiator = initiator;
        this.#clearTimeout();
        this.showPopover();
        return;
      }

      if (
        this.#initiator ||
        (this.disableFocus && initiator === "focus") ||
        (this.disableHover && initiator === "hover")
      ) {
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

    #hidePopover(initiator: PopoverInitiator): void {
      if (!this.popoverBehavior) {
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

    #handleFocus(): void {
      this.#showPopover("focus");
    }

    #handleBlur(): void {
      this.#hidePopover("focus");
    }
  }

  return PopoverElement;
}
