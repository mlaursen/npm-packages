import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  isServer,
  nothing,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import "../dialog-actions/dialog-actions.js";
import "../dialog-content/dialog-content.js";
import "../dialog-header/dialog-header.js";
import "../dialog-title/dialog-title.js";
import { FocusTrapMixin } from "../focus/focus-trap-mixin.js";
import { PopoverMixin } from "../popover/popover-mixin.js";
import { type PopoverInitiator } from "../popover/types.js";
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

type SlotStateName =
  | "_hasHeader"
  | "_hasTitle"
  | "_hasContent"
  | "_hasActions"
  | "_hasPopoverTarget";

const BaseDialog = PopoverMixin(AnimateMixin(FocusTrapMixin(LitElement)));

/**
 * Dialogs are built with the following slots:
 * - rendered in `mwc-dialog-header`:
 *   - `title` - the main title for the dialog
 *   - `icon` - an icon rendered in the header above the title
 *   - `header` - any custom content that is rendered after the optional `title` and `icon`
 *   - the `mwc-dialog-header` will be hidden if none of the slots were provided
 * - rendered in `mwc-dialog-content`:
 *   - `content` - any content to display in the dialog within a scrollable area
 *   - the `mwc-dialog-content` will be hidden if none of the slots were provided
 * - rendered in `mwc-dialog-actions`:
 *   - `actions` - generally buttons used to confirm or cancel
 *   - the `mwc-dialog-actions` will be hidden if none of the slots were provided
 * - rendered in the `dialog` element:
 *   - default slot
 * - rendered before the `dialog` element:
 *   - `popover-target` - this should generally be a button component acting as
 *     the popover target/anchor element
 *
 * The dialog's open state can be controlled any of the following:
 * - toggling the `open` attribute
 * - using a `mwc-button` with `command`/`commandfor`
 *   - [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
 * - triggering the `show()` and `close()` functions directly on the `mwc-dialog`
 * - using `<form method="dialog">` to close the dialog
 * - providing a `slot="popover-target"` which will show on click
 *   - can be configured to show on hover and/or focus as well
 *
 * @example Invoker Commands API Example
 * ```html
 * <mwc-button command="show-modal" commandfor="dialog-1">
 *   Show
 * </mwc-button>
 * <mwc-dialog id="dialog-1">
 *   <h2 slot="title">Title</h2>
 *   <p slot="content">Hello, world!</p>
 *   <mwc-text-button slot="actions" command="close" commandfor="dialog-1">
 *     Cancel
 *   </mwc-text-button>
 *   <mwc-text-button slot="actions" command="close" commandfor="dialog-1" autofocus>
 *     Ok
 *   </mwc-text-button>
 * </mwc-dialog>
 * ```
 *
 * @example Form Dialog Example
 * ```html
 * <mwc-button command="show-modal" commandfor="dialog-1">
 *   Show
 * </mwc-button>
 * <mwc-dialog id="dialog-1">
 *   <h2 slot="title">Title</h2>
 *   <form id="form" slot="content" method="dialog">
 *   </form>
 *   <mwc-text-button slot="actions" form="form">
 *     Cancel
 *   </mwc-text-button>
 *   <mwc-text-button slot="actions" form="form" autofocus>
 *     Ok
 *   </mwc-text-button>
 * </mwc-dialog>
 * ```
 */
@customElement("mwc-dialog")
export class Dialog extends BaseDialog implements DialogProperties {
  static override styles = [...BaseDialog.styles, styles];

  @property()
  label?: string;

  @property()
  labelledBy?: string;

  @property()
  describedBy?: string;

  @property({ reflect: true, attribute: "popover-initiator" })
  override popoverInitiator: PopoverInitiator = "click";

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
  protected _dialog?: HTMLDialogElement;

  @query("#header")
  protected _header?: HTMLElement;

  @query("#content")
  protected _content?: HTMLElement;

  @query("#actions")
  protected _actions?: HTMLElement;

  @state()
  protected _hasHeader = false;

  @state()
  protected _hasTitle = false;

  @state()
  protected _hasContent = false;

  @state()
  protected _hasActions = false;

  #prevReturnValue = "";

  getOpenAnimation: GetAnimationMap<AnimateDialogElementMap> = () =>
    DEFAULT_DIALOG_OPEN_ANIMATION;
  getCloseAnimation: GetAnimationMap<AnimateDialogElementMap> = () =>
    DEFAULT_DIALOG_CLOSE_ANIMATION;

  override getFallbackFocus = (): HTMLElement | null | undefined =>
    this._dialog;

  constructor() {
    super();

    if (!isServer) {
      this.addEventListener("submit", this.#handleSubmit);
    }
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

    if (changed.has("_hasPopoverTarget")) {
      if (this._hasPopoverTarget) {
        this.popoverType ??= "manual";
      } else {
        this.popoverType = undefined;
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
      popover: this._hasPopoverTarget,
    });

    return html`
      ${this.renderPopoverTarget()}
      <dialog
        aria-label=${this.label || nothing}
        aria-labelledby=${labelledBy}
        aria-describedby=${describedBy}
        role=${ifDefined(isAlert ? "alertdialog" : undefined)}
        @click=${this.#handleClick}
        @cancel=${this.#handleCancel}
        class=${className}
        popover=${ifDefined(
          this._hasPopoverTarget ? (this.popoverType ?? "manual") : undefined,
        )}
      >
        ${(this.open && this.renderFocusTrap(true)) || nothing}
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
        ${(this.open && this.renderFocusTrap(false)) || nothing}
      </dialog>
    `;
  }

  // this is just added to provide the correct type definitions
  override close(options?: CloseDialogOptions): Promise<void> {
    return super.close(options);
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

  #handleSubmit(event: SubmitEvent): void {
    const form = event.target;
    const { submitter } = event;
    if (
      !(form instanceof HTMLFormElement) ||
      form.method !== "dialog" ||
      !submitter
    ) {
      return;
    }

    this.close({
      returnValue: submitter.getAttribute("value") ?? this.returnValue,
    });
  }

  #handleClick(event: MouseEvent): void {
    if (this.type === "alert" || event.target !== event.currentTarget) {
      return;
    }

    const rect = this._dialog?.getBoundingClientRect();
    if (
      rect &&
      event.clientX > rect.left &&
      event.clientX < rect.right &&
      event.clientY > rect.top &&
      event.clientY < rect.bottom
    ) {
      return;
    }

    const success = this.dispatchEvent(
      new Event("cancel", { cancelable: true }),
    );
    if (success) {
      this.close();
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
