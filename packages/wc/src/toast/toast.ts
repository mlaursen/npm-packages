import {
  LitElement,
  html,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, query, state } from "lit/decorators.js";

import { OpenCloseAnimateMixin } from "../animations/open-close-animate-mixin.js";
import type {
  AnimationList,
  AnimationOptions,
  GetAnimationMap,
} from "../animations/types.js";
import { AsyncClickEvent } from "../async-button/events.js";
import { CustomCommandMixin } from "../custom-command-mixin/custom-command-mixin.js";
import { ElevationMixin } from "../elevation/elevation-mixin.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { redispatchAsyncEvent } from "../utils/dispatch-async-event.js";
import { mergeStyles } from "../utils/mergeStyles.js";
import { isSlotted } from "../utils/slots.js";
import {
  DEFAULT_TOAST_CLOSE_ANIMATION,
  DEFAULT_TOAST_OPEN_ANIMATION,
  DEFAULT_TOAST_TIMEOUT,
} from "./constants.js";
import { ToastTimeoutPausedEvent, ToastTimeoutStartedEvent } from "./events.js";
import styles from "./toast-styles.js";
import type {
  AnimateToastElementMap,
  ToastPlacement,
  ToastProperties,
  ToastShape,
  ToastTimeoutPausedReason,
  ToastTimeoutStartedReason,
} from "./types.js";

const BaseStyledToast = CustomCommandMixin(
  OpenCloseAnimateMixin(ElevationMixin(MarginMixin(LitElement))),
);

/**
 * @slot - The default slot
 * @slot content -
 * @slot action -
 * @slot action-button -
 * @slot close-button -
 * @slot close-icon -
 *
 * @fires {Event} open - Fired before the show animation occurs and can be used
 * to cancel opening the element by calling `event.preventDefault()`.
 * @fires {Event} opened - Fired once the element has opened and the animations
 * have completed.
 * @fires {Event} close - Fired before the hide animation occurs and can be
 * used to cancel closing the element by calling `event.preventDefault()`.
 * @fires {Event} closed - Fired once the element has closed and the animations
 * have completed.
 * @fires {ToastTimeoutStartedEvent} - Fires when the timeout is started
 * @fires {ToastTimeoutPausedEvent} - Fires when the timeout is started
 *
 */
export class Toast extends BaseStyledToast implements ToastProperties {
  static override styles = mergeStyles(BaseStyledToast, styles);
  static readonly elementName: string = "mwc-toast";

  @property({ reflect: true })
  shape: ToastShape = "square";

  @property({ reflect: true })
  placement: ToastPlacement = "end-center";

  @property({ type: Boolean, attribute: "close-button", reflect: true })
  closeButton = false;

  @property({ type: Number })
  timeout: number | null = DEFAULT_TOAST_TIMEOUT;

  @property({ type: Boolean, reflect: true })
  paused = false;

  @state()
  _hasAction = false;

  @state()
  _hasActionButton = false;

  @state()
  _hasCloseButton = false;

  @query(".popover")
  _popover?: HTMLDivElement;

  @query(".toast")
  _toast?: HTMLDivElement;

  @query("[name=content]")
  _content?: HTMLElement;

  @query("[name=action-button]")
  _action?: HTMLElement;

  @query("[name=close-button]")
  _closeButton?: HTMLElement;

  getOpenAnimation: GetAnimationMap<AnimateToastElementMap> = () =>
    DEFAULT_TOAST_OPEN_ANIMATION;
  getCloseAnimation: GetAnimationMap<AnimateToastElementMap> = () =>
    DEFAULT_TOAST_CLOSE_ANIMATION;

  #focused = false;
  #hovered = false;
  #pending = false;
  #timeout: NodeJS.Timeout | undefined;
  #startTime: number | null = null;
  #elapsedTime: number | null = null;

  override _getAnimations(options: AnimationOptions): AnimationList {
    const { animate = true, opening } = options;
    if (!animate) {
      return [];
    }

    const getDefault = opening ? this.getOpenAnimation : this.getCloseAnimation;
    const { toast, content, action, closeButton } =
      animate === true ? getDefault() : animate();

    return [
      [this._toast, toast],
      [this._content, content],
      [this._action, action],
      [this._closeButton, closeButton],
    ];
  }

  override connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener("visibilitychange", this.#handleVisibilityChange);
    this.addEventListener("focusin", this.#handleFocusIn);
    this.addEventListener("focusout", this.#handleFocusOut);
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (
      changed.has("_hasAction") ||
      changed.has("_hasActionButton") ||
      changed.has("_hasCloseButton") ||
      changed.has("closeButton")
    ) {
      this.toggleAttribute(
        "remove-padding-end",
        this._hasAction ||
          this._hasActionButton ||
          this._hasCloseButton ||
          this.closeButton,
      );
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#clearTimeoutState();
    document.removeEventListener(
      "visibilitychange",
      this.#handleVisibilityChange,
    );
    this.removeEventListener("focusin", this.#handleFocusIn);
    this.removeEventListener("focusout", this.#handleFocusOut);
  }

  override render(): TemplateResult {
    return html`
      <div id="popover" popover="manual" class="popover">
        <div
          @mouseenter=${this.#handleMouseEnter}
          @mouseleave=${this.#handleMouseLeave}
          class="toast"
        >
          <slot name="content"
            ><mwc-typography variant="body" size="medium"
              ><div><slot></slot></div></mwc-typography
          ></slot>
          ${this.#renderActionButton()}${this.#renderCloseButton()}
        </div>
      </div>
    `;
  }

  #renderActionButton(): TemplateResult {
    const hasActionButton = this._hasAction || this._hasActionButton;
    return html`
      <slot
        name="action-button"
        ?hidden=${!hasActionButton}
        @slotchange=${this.#handleActionButtonSlotChange}
      >
        <mwc-async-button
          @async-click=${this.#handleAction}
          color="inverse-primary"
          variant="text"
          shape=${this.shape}
          ><slot
            name="action"
            @slotchange=${this.#handleActionSlotChange}
          ></slot
        ></mwc-async-button>
      </slot>
    `;
  }

  #renderCloseButton(): TemplateResult {
    const hasCloseButton = this.closeButton || this._hasCloseButton;
    return html`
      <slot
        name="close-button"
        ?hidden=${!hasCloseButton}
        @slotchange=${this.#handleCloseButtonSlotChange}
      >
        <mwc-icon-button
          aria-label="Close"
          color="inverse-on-surface"
          shape=${this.shape}
          @click=${this.#closeToast}
          ><slot name="close-icon"
            ><mwc-material-symbol>close</mwc-material-symbol></slot
          ></mwc-icon-button
        >
      </slot>
    `;
  }

  override showPopover(): void {
    this.open = true;
  }

  override _showElement(): void {
    this._popover?.showPopover();

    super._showElement();
  }

  override hidePopover(): void {
    this.open = false;
  }

  override _closeElement(): void {
    this._popover?.hidePopover();

    super._closeElement();
  }

  override _onOpened(): void {
    this.#startOrResume("opened");
  }

  override _onClosed(): void {
    this.#clearTimeoutState();
  }

  #clearTimeout(): void {
    globalThis.clearTimeout(this.#timeout);
    this.#timeout = undefined;
  }

  #clearTimeTrackers(): void {
    this.#startTime = null;
    this.#elapsedTime = null;
  }

  #clearTimeoutState(): void {
    this.#clearTimeout();
    this.#clearTimeTrackers();
  }

  #startOrResume(reason: ToastTimeoutStartedReason): void {
    this.#clearTimeout();
    if (this.timeout === null || this.timeout <= 0) {
      this.#clearTimeTrackers();
      return;
    }

    if (this.#focused || this.#hovered || this.#pending) {
      return;
    }

    this.#elapsedTime ??= 0;
    const remainingTime = Math.max(this.timeout - this.#elapsedTime);
    this.#startTime = Date.now();

    this.dispatchEvent(
      new ToastTimeoutStartedEvent(
        {
          reason,
          startTime: this.#startTime,
          elapsedTime: this.#elapsedTime,
          remainingTime,
        },
        { bubbles: true, composed: true },
      ),
    );

    this.#timeout = globalThis.setTimeout(() => {
      this.close();
    }, remainingTime);
  }

  #pause(reason: ToastTimeoutPausedReason): void {
    this.#clearTimeout();

    // can't pause a timeout that never started
    if (this.#startTime === null || this.#elapsedTime === null) {
      return;
    }

    this.#elapsedTime = Date.now() - this.#startTime + this.#elapsedTime;
    this.dispatchEvent(
      new ToastTimeoutPausedEvent(
        {
          reason,
          startTime: this.#startTime,
          elapsedTime: this.#elapsedTime,
          remainingTime: this.#startTime - this.#elapsedTime,
        },
        { bubbles: true, composed: true },
      ),
    );
    this.#startTime = null;
  }

  async #handleAction(event: AsyncClickEvent): Promise<void> {
    const { rejected } = await redispatchAsyncEvent({
      EventClass: AsyncClickEvent,
      element: this,
      sourceEvent: event,
      onBeforeWait: () => {
        this.#pending = true;
        this.#pause("action-pending");
      },
      bubbles: true,
      composed: true,
    });
    if (this.#pending) {
      this.#startOrResume("action-resolved");
    }
    this.#pending = false;

    if (!rejected) {
      this.close();
    }
  }

  #handleMouseEnter(): void {
    this.#hovered = true;
    this.#pause("hover");
  }

  #handleMouseLeave(): void {
    this.#hovered = false;
    this.#startOrResume("unhover");
  }

  #handleFocusIn(): void {
    this.#focused = true;
    this.#pause("focus");
  }

  #handleFocusOut(event: FocusEvent): void {
    if (
      event.relatedTarget instanceof Element &&
      this.contains(event.relatedTarget)
    ) {
      return;
    }

    this.#focused = false;
    this.#startOrResume("blur");
  }

  #closeToast(_event: Event): void {
    this.close();
  }

  #handleActionButtonSlotChange(event: Event): void {
    this._hasActionButton = isSlotted(event);
  }

  #handleActionSlotChange(event: Event): void {
    this._hasAction = isSlotted(event);
  }

  #handleCloseButtonSlotChange(event: Event): void {
    this._hasCloseButton = isSlotted(event);
  }

  #handleVisibilityChange = (): void => {
    if (document.visibilityState === "hidden") {
      this.#pause("hidden");
    } else {
      this.#startOrResume("visible");
    }
  };
}
