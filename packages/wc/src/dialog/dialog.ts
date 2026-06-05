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
import { AnimateMixin } from "../transition/animate-mixin.js";
import {
  type AnimateOptions,
  type AnimationList,
  type GetAnimationMap,
} from "../transition/types.js";
import { isSlotted } from "../utils/slots.js";
import {
  DEFAULT_DIALOG_CLOSE_ANIMATION,
  DEFAULT_DIALOG_OPEN_ANIMATION,
} from "./constants.js";
import styles from "./dialog-styles.js";
import {
  type AnimateDialogElementMap,
  type CloseDialogOptions,
  type DialogProperties,
  type DialogType,
  type DialogWidth,
} from "./types.js";

type SlotStateName = "_hasHeader" | "_hasTitle" | "_hasContent" | "_hasActions";

const BaseDialog = AnimateMixin(FocusTrapMixin(LitElement));

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

  @query("#content")
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

  #prevReturnValue = "";

  getOpenAnimation: GetAnimationMap<AnimateDialogElementMap> = () =>
    DEFAULT_DIALOG_OPEN_ANIMATION;
  getCloseAnimation: GetAnimationMap<AnimateDialogElementMap> = () =>
    DEFAULT_DIALOG_CLOSE_ANIMATION;

  override getFallbackFocus = (): HTMLElement | null | undefined =>
    this._dialog;

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

  override _isOpenable(): boolean {
    return !!this._dialog && !this._dialog.open;
  }

  override _isClosable(): boolean {
    return !!this._dialog && this._dialog.open;
  }

  override _showElement(): void {
    this._dialog?.showModal();

    this.open = true;
    this._content?.scrollTo({ top: 0 });
    this.querySelector<HTMLElement>("[autofocus]")?.focus();
  }

  override _closeElement(): void {
    this._dialog?.close();
    this.open = false;
  }

  override _onNotClosable(): void {
    this.open = false;
  }

  override _onNotConnectedClose(): void {
    this.open = false;
  }

  override _getAnimations(options: AnimateOptions): AnimationList {
    const { animate = true, opening } = options;
    if (!animate) {
      return [];
    }

    const getDefault = opening ? this.getOpenAnimation : this.getCloseAnimation;
    const { dialog, actions, content, header } =
      animate === true ? getDefault() : animate();

    return [
      [this._dialog, dialog],
      [(this._hasHeader || this._hasTitle) && this._header, header],
      [this._hasContent && this._content, content],
      [this._hasActions && this._actions, actions],
    ];
  }

  override _onBeforeClose(options: CloseDialogOptions): void {
    this.#prevReturnValue = this.returnValue;
    this.returnValue = options.returnValue ?? "";
  }

  override _onCloseCanceled(): void {
    this.returnValue = this.#prevReturnValue;
  }

  showModal(): void {
    this.show();
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
