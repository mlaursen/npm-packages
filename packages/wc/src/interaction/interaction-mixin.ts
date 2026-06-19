import { wait } from "@mlaursen/utils";
import {
  type CSSResultArray,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import {
  type StylableLitElement,
  type StyledLitElementWithProperties,
} from "../types.js";
import { MINIMUM_PRESS_MS, TOUCH_DELAY_MS } from "./constants.js";
import interactionStyles from "./interaction-styles.js";
import { type Interactable, type InteractionDirection } from "./types.js";
import {
  getRippleAnimationArgs,
  isActionableEvent,
  isTouchEvent,
} from "./utils.js";

const enum RippleState {
  Inactive,
  TouchDelay,
  Holding,
  WaitingForClick,
}

export function InteractionMixin<T extends StylableLitElement>(
  Base: T,
  disableTabIndex = false,
): StyledLitElementWithProperties<Interactable, T> {
  let styles: CSSResultArray = [interactionStyles];
  if (Base.styles) {
    const baseStyles = Array.isArray(Base.styles) ? Base.styles : [Base.styles];
    styles = [interactionStyles, ...baseStyles];
  }

  class InteractionElement extends Base implements Interactable {
    static override styles = styles;

    @property({ reflect: true })
    interaction: InteractionDirection = "outward";

    @property({ reflect: true, type: Boolean })
    disabled = false;

    @property({ type: Boolean, attribute: "disable-ripple" })
    disableRipple = false;

    @property({ type: Boolean, reflect: true, attribute: "focus-visible" })
    _focusVisible = false;

    @query(".ripple")
    _ripple?: HTMLSpanElement;

    @query(".state-layer")
    _stateLayer?: HTMLSpanElement;

    @state()
    _pressed = false;

    #state: RippleState = RippleState.Inactive;
    #startEvent?: PointerEvent;
    #animation?: Animation;
    #animationController?: AbortController;

    override willUpdate(changed: PropertyValues): void {
      if (changed.has("disabled") && !disableTabIndex) {
        this.tabIndex = this.disabled ? -1 : 0;
      }
    }

    protected override updated(changed: PropertyValues): void {
      super.updated(changed);

      if (changed.has("disableRipple") || changed.has("disabled")) {
        this.#bindRippleHandlers(!this.disableRipple && !this.disabled);
      }
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.#animationController?.abort();
      this.#bindRippleHandlers(false);
    }

    _renderStateLayer(): TemplateResult {
      return html`
        <span class="state-layer ${this.#getStateLayerClassName()}"></span>
      `;
    }

    _renderRipple(): TemplateResult | null {
      if (this.disableRipple) {
        return null;
      }

      return html`
        <span class="ripple ${this.#getStateLayerClassName()}"></span>
      `;
    }

    _updateFocusVisible(event: FocusEvent): void {
      const target = event.currentTarget;

      this._focusVisible =
        target instanceof HTMLElement && target.matches(":focus-visible");
    }

    #getStateLayerClassName(): ReturnType<typeof classMap> {
      return classMap({
        disabled: this.disabled,
        pressed: this._pressed,
      });
    }

    #bindRippleHandlers(add: boolean): void {
      const name = add ? "addEventListener" : "removeEventListener";

      this[name]("pointerleave", this.#handlePointerLeave);
      this[name]("pointerup", this.#handlePointerUp);
      this[name]("pointerdown", this.#handlePointerDown);
      this[name]("pointercancel", this.#handlePointerCancel);
      this[name]("contextmenu", this.#handleContextMenu);
      this[name]("click", this.#handleClick);
    }

    #startPressAnimation(event?: Event): void {
      this._pressed = true;
      this.#animationController?.abort();
      this.#animationController = new AbortController();

      if (!this._ripple) {
        return;
      }

      const args = getRippleAnimationArgs({
        rect: this.getBoundingClientRect(),
        zoom: this.currentCSSZoom,
        event,
      });

      const animation = this._ripple.animate(...args);
      this.#animationController.signal.addEventListener("abort", () => {
        animation.cancel();
      });
      this.#animation = animation;
    }

    async #stopPressAnimation(): Promise<void> {
      this.#state = RippleState.Inactive;

      const animation = this.#animation;
      let currentTime = Infinity;
      if (typeof animation?.currentTime === "number") {
        ({ currentTime } = animation);
      } else if (animation?.currentTime) {
        currentTime = animation.currentTime.to("ms").value;
      }

      if (currentTime >= MINIMUM_PRESS_MS) {
        this._pressed = false;
        return;
      }

      await wait(MINIMUM_PRESS_MS - currentTime);
      if (animation !== this.#animation) {
        return;
      }

      this._pressed = false;
    }

    #isActionableEvent(event: Event): event is PointerEvent {
      return isActionableEvent({
        event,
        disabled: this.disabled,
        startEvent: this.#startEvent,
      });
    }

    #handlePointerLeave(event: Event): void {
      if (!this.#isActionableEvent(event)) {
        return;
      }

      if (this.#state !== RippleState.Inactive) {
        this.#stopPressAnimation();
      }
    }

    #handlePointerUp(event: Event): void {
      if (!this.#isActionableEvent(event)) {
        return;
      }

      if (this.#state === RippleState.Holding) {
        this.#state = RippleState.WaitingForClick;
      } else if (this.#state === RippleState.TouchDelay) {
        this.#state = RippleState.WaitingForClick;
        this.#startPressAnimation(this.#startEvent);
      }
    }

    async #handlePointerDown(event: Event): Promise<void> {
      if (!this.#isActionableEvent(event)) {
        return;
      }

      this.#startEvent = event;
      if (!isTouchEvent(event)) {
        this.#state = RippleState.WaitingForClick;
        this.#startPressAnimation(event);
        return;
      }

      this.#state = RippleState.TouchDelay;
      await wait(TOUCH_DELAY_MS);
      if (this.#state !== RippleState.TouchDelay) {
        return;
      }

      this.#state = RippleState.Holding;
      this.#startPressAnimation(event);
    }

    #handlePointerCancel(event: Event): void {
      if (!this.#isActionableEvent(event)) {
        return;
      }

      this.#stopPressAnimation();
    }

    #handleContextMenu(): void {
      if (this.disabled) {
        return;
      }

      this.#stopPressAnimation();
    }

    #handleClick(): void {
      if (this.disabled) {
        return;
      }

      if (this.#state === RippleState.WaitingForClick) {
        this.#stopPressAnimation();
      } else if (this.#state === RippleState.Inactive) {
        this.#startPressAnimation();
        this.#stopPressAnimation();
      }
    }
  }

  return InteractionElement;
}
