import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { FocusTrapMixin } from "../focus/focus-trap-mixin.js";
import { type GetAnimationMap } from "../transition/types.js";
import { isSlotted } from "../utils/slots.js";
import {
  DEFAULT_DIALOG_CLOSE_ANIMATION,
  DEFAULT_DIALOG_OPEN_ANIMATION,
} from "./constants.js";
import styles from "./dialog-styles.js";
import {
  type AnimateDialogOptions,
  type CloseDialogOptions,
  type DialogProperties,
  type DialogType,
  type DialogWidth,
  type ShowDialogOptions,
} from "./types.js";

type SlotStateName = "_hasHeader" | "_hasTitle" | "_hasContent" | "_hasActions";

const BaseDialog = FocusTrapMixin(LitElement);

@customElement("mwc-dialog")
export class Dialog extends BaseDialog implements DialogProperties {
  static override styles = styles;

  @property()
  label?: string;

  @property()
  labelledBy?: string;

  @property()
  describedBy?: string;

  /**
   * @see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue)
   */
  @property({ attribute: false })
  returnValue = "";

  @property({ type: Boolean })
  open: boolean = false;

  @property()
  type?: DialogType;

  @property()
  width?: DialogWidth;

  @query("dialog")
  private _dialog?: HTMLDialogElement;

  @query("#header")
  private _header?: HTMLElement;

  @query("#contents")
  private _content?: HTMLElement;

  @query("#actions")
  private _actions?: HTMLElement;

  @state()
  private _hasHeader = false;

  @state()
  private _hasTitle = false;

  @state()
  private _hasContent = false;

  @state()
  private _hasActions = false;

  #opening = false;
  #connectedResolvers = Promise.withResolvers<undefined>();
  #animationController?: AbortController;

  getOpenAnimation: GetAnimationMap<AnimateDialogOptions> = () =>
    DEFAULT_DIALOG_OPEN_ANIMATION;
  getCloseAnimation: GetAnimationMap<AnimateDialogOptions> = () =>
    DEFAULT_DIALOG_CLOSE_ANIMATION;

  override getFallbackFocus = (): HTMLElement | null | undefined =>
    this._dialog;

  override connectedCallback(): void {
    super.connectedCallback();

    // might need to add form stuffs to handle submit
    this.#connectedResolvers.resolve(void 0);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#connectedResolvers = Promise.withResolvers();
    this.#animationController?.abort();
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("open")) {
      if (this.open) {
        this.show();
      } else {
        this.close();
      }
    }
  }

  override render(): TemplateResult {
    const isAlert = this.type === "alert";
    const hasHeader = this._hasHeader || this._hasTitle;
    const labelledBy =
      this.labelledBy || (this._hasTitle && "title") || nothing;
    const describedBy =
      this.describedBy || (this._hasContent && isAlert && "content") || nothing;

    const className = classMap({
      header: hasHeader && this._hasContent,
      actions: this._hasActions && this._hasContent,
    });

    return html`
      <dialog
        aria-label=${this.label || nothing}
        aria-labelledby=${labelledBy}
        aria-describedby=${describedBy}
        role=${ifDefined(isAlert ? "alertdialog" : undefined)}
        @click=${this.#handleClick}
        @cancel=${this.#handleCancel}
        class=${className}
      >
        ${(this.open && this.renderFocusTrap()) || nothing}
        <mwc-dialog-header id="header" ?hidden=${!hasHeader}>
          <slot name="icon" slot="icon"></slot>
          <mwc-dialog-title id="title" ?hidden=${!this._hasTitle}>
            <slot name="title" @slotchange=${this.#handleTitleSlotChange}>
            </slot>
          </mwc-dialog-title>
          <slot name="header" @slotchange=${this.#handleHeaderSlotChange}>
          </slot>
        </mwc-dialog-header>
        <mwc-dialog-content id="content" ?hidden=${!this._hasContent}>
          <slot name="content" @slotchange=${this.#handleContentSlotChange}>
          </slot>
        </mwc-dialog-content>
        <mwc-dialog-actions ?hidden=${!this._hasActions} align="end">
          <slot name="actions" @slotchange=${this.#handleActionsSlotChange}>
          </slot>
        </mwc-dialog-actions>
        <slot></slot>
        ${(this.open && this.renderFocusTrap()) || nothing}
      </dialog>
    `;
  }

  async show(options: ShowDialogOptions = {}): Promise<void> {
    const { animate } = options;
    this.#opening = true;

    await this.#connectedResolvers.promise;
    await this.updateComplete;
    const dialog = this._dialog;

    if (!this.#opening || !dialog || dialog.open) {
      this.#opening = false;
      return;
    }

    const canceled = !this.dispatchEvent(
      new Event("open", { cancelable: true }),
    );
    if (canceled) {
      this.#opening = false;
      return;
    }

    dialog.showModal();
    this.open = true;
    this._content?.scrollTo({ top: 0 });
    this.querySelector<HTMLElement>("[autofocus]")?.focus();

    await this.#animate(this.#getAnimations(animate, true));
    this.dispatchEvent(new Event("opened"));
    this.#opening = false;
  }

  async close(options: CloseDialogOptions = {}): Promise<void> {
    const { animate, returnValue = "" } = options;

    this.#opening = false;
    if (!this.isConnected) {
      this.open = false;
      return;
    }

    await this.updateComplete;
    const dialog = this._dialog;
    if (this.#opening || !dialog || !dialog.open) {
      this.open = false;
      return;
    }

    const prevReturnValue = this.returnValue;
    this.returnValue = returnValue;
    const canceled = !this.dispatchEvent(
      new Event("close", { cancelable: true }),
    );
    if (canceled) {
      this.returnValue = prevReturnValue;
      return;
    }

    await this.#animate(this.#getAnimations(animate, false));
    dialog.close(options.returnValue);
    this.open = false;
    this.dispatchEvent(new Event("closed"));
  }

  showModal(): void {
    this.show();
  }

  #getAnimations(
    animate: ShowDialogOptions["animate"] = true,
    enter: boolean,
  ): Readonly<AnimateDialogOptions> {
    const getDefault = enter ? this.getOpenAnimation : this.getCloseAnimation;
    if (typeof animate === "boolean") {
      if (animate) {
        return getDefault();
      }

      return {};
    }

    return animate();
  }

  async #animate(options: Readonly<AnimateDialogOptions>): Promise<void> {
    this.#animationController?.abort();
    this.#animationController = new AbortController();

    const { dialog, header, content, actions } = options;
    const animations = [
      [this._dialog, dialog],
      [(this._hasHeader || this._hasTitle) && this._header, header],
      [this._hasContent && this._content, content],
      [this._hasActions && this._actions, actions],
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

  #handleClick(event: MouseEvent): void {
    if (this.type !== "alert" && event.target === event.currentTarget) {
      const success = this.dispatchEvent(
        new Event("cancel", { cancelable: true }),
      );
      if (success) {
        this.close();
      }
    }
  }

  #handleCancel(event: Event): void {
    if (event.target !== this._dialog) {
      return;
    }

    event.preventDefault();
    this.close();
  }

  #handleSlotChange(event: Event, name: SlotStateName): void {
    this[name] = isSlotted(event);
  }

  #handleHeaderSlotChange(event: Event): void {
    this.#handleSlotChange(event, "_hasHeader");
  }

  #handleTitleSlotChange(event: Event): void {
    this.#handleSlotChange(event, "_hasTitle");
  }

  #handleContentSlotChange(event: Event): void {
    this.#handleSlotChange(event, "_hasContent");
  }

  #handleActionsSlotChange(event: Event): void {
    this.#handleSlotChange(event, "_hasActions");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog": Dialog;
  }
}
