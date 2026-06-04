import { type CSSResultArray, type TemplateResult, html } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import type { GetAnimationMap } from "../transition/types.js";
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
  type BasePopoverAnimateOptions,
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

  class PopoverElement extends Base implements PopoverProperties {
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
    #opening = false;
    #connectedResolvers = Promise.withResolvers<undefined>();
    #animationController?: AbortController;

    protected override firstUpdated(): void {
      this._popover?.addEventListener("toggle", this.#handleToggle);
    }

    override connectedCallback(): void {
      super.connectedCallback();

      this.addEventListener("mouseenter", this.#handleMouseEnter);
      this.addEventListener("mouseleave", this.#handleMouseLeave);
      this.addEventListener("focus", this.#handleFocus, true);
      this.addEventListener("blur", this.#handleBlur, true);
      this.#connectedResolvers.resolve(void 0);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.removeEventListener("mouseenter", this.#handleMouseEnter);
      this.removeEventListener("mouseleave", this.#handleMouseLeave);
      this.removeEventListener("focus", this.#handleFocus, true);
      this.removeEventListener("blur", this.#handleBlur, true);

      this._popover?.removeEventListener("toggle", this.#handleToggle);
      this.#clearTimeout();
      this.#connectedResolvers = Promise.withResolvers();
      this.#animationController?.abort();
    }

    renderPopoverTarget(options: RenderPopoverTargetOptions): TemplateResult {
      const { target, content } = options;
      return html`
        <slot name="target">${target}</slot>
        <div id="popover" popover=${ifDefined(this.popoverBehavior)}>
          <div id="content">${content}</div>
        </div>
      `;
    }

    override async showPopover(
      options?: Readonly<BasePopoverAnimateOptions>,
    ): Promise<void> {
      this.#opening = true;

      await this.#connectedResolvers.promise;
      await this.updateComplete;

      const popover = this._popover;
      if (!this.#opening || !popover) {
        this.#opening = false;
        return;
      }

      const canceled = !this.dispatchEvent(
        new Event("show-popover", { cancelable: true }),
      );
      if (canceled) {
        this.#opening = false;
        return;
      }

      popover.showPopover();
      await this.#animate(this.#getAnimations(options?.animate, true));
      this.dispatchEvent(new Event("popover-open"));
      this.#opening = false;
    }

    override async hidePopover(
      options?: Readonly<BasePopoverAnimateOptions>,
    ): Promise<void> {
      this.#opening = false;
      if (!this.isConnected) {
        return;
      }

      await this.updateComplete;
      const popover = this._popover;
      if (!popover) {
        return;
      }

      const canceled = !this.dispatchEvent(
        new Event("hide-popover", { cancelable: true }),
      );
      if (canceled) {
        return;
      }

      await this.#animate(this.#getAnimations(options?.animate, false));
      popover.hidePopover();
      this.dispatchEvent(new Event("popover-closed"));
    }

    async #animate(
      options: Readonly<AnimatePopoverElementMap> = {},
    ): Promise<void> {
      this.#animationController?.abort();
      this.#animationController = new AbortController();

      const { popover, target } = options;
      const animations = [
        [this._popover, popover],
        [this._target?.assignedElements(), target],
      ] as const;

      const promises: Promise<Animation>[] = [];
      for (const [elementOrElements, animationArgs] of animations) {
        if (!animationArgs?.length || !elementOrElements) {
          continue;
        }

        const elements = Array.isArray(elementOrElements)
          ? elementOrElements
          : [elementOrElements];
        for (const element of elements) {
          for (const args of animationArgs) {
            const animation = element.animate(...args);
            this.#animationController.signal.addEventListener("abort", () => {
              animation.cancel();
            });

            promises.push(animation.finished.catch(() => animation));
          }
        }
      }

      await Promise.all(promises);
    }

    #getAnimations(
      animate: BasePopoverAnimateOptions["animate"] = true,
      enter: boolean,
    ): Readonly<AnimatePopoverElementMap> {
      const getDefault = enter
        ? this.getShowPopoverAnimation
        : this.getHidePopoverAnimation;
      if (typeof animate === "boolean") {
        if (animate) {
          return getDefault();
        }

        return {};
      }

      return animate();
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
