import type { PropertyValues, TemplateResult } from "lit";
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { FocusTrapMixin } from "../focus/focus-trap-mixin.js";
import { AnimateMixin } from "../transition/animate-mixin.js";
import type {
  AnimateOptions,
  AnimationList,
  GetAnimationMap,
} from "../transition/types.js";
import { isSlotted } from "../utils/slots.js";
import {
  DEFAULT_DIALOG_CLOSE_ANIMATION,
  DEFAULT_DIALOG_OPEN_ANIMATION,
} from "./constants.js";
import styles from "./dialog-styles.js";
import type {
  AnimateDialogElementMap,
  CloseDialogOptions,
  DialogProperties,
  DialogShape,
  DialogType,
  DialogWidth,
  RenderDialogOptions,
} from "./types.js";

const BaseDialog = AnimateMixin(FocusTrapMixin(LitElement));

/**
 * The dialog's open state can be controlled any of the following:
 * - toggling the `open` attribute
 * - using a `mwc-button` with `command`/`commandfor`
 *   - [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
 * - triggering the `show()` and `close()` functions directly on the `mwc-dialog`
 * - using `<form method="dialog">` to close the dialog
 *
 * @example Invoker Commands API Example
```html
<mwc-button command="show-modal" commandfor="dialog-1">
  Show
</mwc-button>
<mwc-dialog id="dialog-1">
  <h2 slot="title">Title</h2>
  <p slot="content">Hello, world!</p>
  <mwc-text-button slot="actions" command="close" commandfor="dialog-1">
    Cancel
  </mwc-text-button>
  <mwc-text-button slot="actions" command="close" commandfor="dialog-1" autofocus>
    Ok
  </mwc-text-button>
</mwc-dialog>
```
 *
 * @example Form Dialog Example
```html
<mwc-button command="show-modal" commandfor="dialog-1">
  Show
</mwc-button>
<mwc-dialog id="dialog-1">
  <h2 slot="title">Title</h2>
  <form id="form" slot="content" method="dialog">
  </form>
  <mwc-text-button slot="actions" form="form">
    Cancel
  </mwc-text-button>
  <mwc-text-button slot="actions" form="form" autofocus>
    Ok
  </mwc-text-button>
</mwc-dialog>
```
 *
 * NOTE: The `<mwc-dialog-header>` will be hidden if the `title`, `icon`, and
 * `header` slots are not provided.
 * NOTE: The `<mwc-dialog-content>` will be hidden if the `content` slot was not
 * provided.
 * NOTE: The `<mwc-dialog-actions>` will be hidden if the `actions` slot was not
 * provided.
 *
 * @slot - The default slot that should only be used if none of the default
 * styling should be used. This is placed after all the other slots but before
 * the last focus trap
 * @slot title - An optional slot that will be rendered in
 * the`<mwc-dialog-header>` in the `title` slot
 * @slot icon - An optional slot that will be rendered in
 * the`<mwc-dialog-header>` above the `title`
 * @slot header - An optional slot for rendering any custom content in the
 * `<mwc-dialog-header>` after the `title` and `icon`
 * @slot content - An optional slot where the main content of the dialog should
 * be placed. It will be rendered within the `<mwc-dialog-content>` so that
 * scrolling and default padding is provided.
 * @slot dialog-header - An optional slot that can be used if the
 * `<mwc-dialog-header>` slots do not work for your use case.
 * @slot dialog-content - An optional slot that can be used if the default
 * `<mwc-dialog-content>` slot does not work for your use case.
 * @slot dialog-actions - An optional slot that can be used if the default
 * `<mwc-dialog-actions>` slot does not work for your use case
 *
 * @fires {Event} open - Fired before the show animation occurs and can be used
 * to cancel opening the element by calling `event.preventDefault()`.
 * @fires {Event} opened - Fired once the element has opened and the animations
 * have completed.
 * @fires {Event} close - Fired before the hide animation occurs and can be
 * used to cancel closing the element by calling `event.preventDefault()`.
 * @fires {Event} closed - Fired once the element has closed and the animations
 * have completed.
 */
export class Dialog extends BaseDialog implements DialogProperties {
  static override styles = [styles];

  protected readonly titleId = "title";
  protected readonly headerId = "header";
  protected readonly contentId = "content";
  protected readonly actionsId = "actions";

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
  type: DialogType = "modal";

  @property({ reflect: true })
  shape: DialogShape = "round";

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

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("submit", this.#handleSubmit);
    this.addEventListener("request-close", this.#handleRequestClose);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("submit", this.#handleSubmit);
    this.removeEventListener("request-close", this.#handleRequestClose);
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

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);

    if (!changed.has("open")) {
      return;
    }

    if (this.open && (this.type === "alert" || this.type === "modal")) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.removeProperty("overflow");
    }
  }

  override render(): TemplateResult {
    return this.renderDialog();
  }

  protected renderDialog({
    header = this.renderDefaultHeader(),
    content = this.renderDefaultContent(),
    actions = this.renderDefaultActions(),
  }: RenderDialogOptions = {}): TemplateResult {
    const isAlert = this.type === "alert";
    const hasHeader = this._hasHeader || this._hasTitle;
    const labelledBy =
      this.labelledBy || (this._hasTitle && this.titleId) || nothing;
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
        ${(this.open && this.renderFocusTrap("first")) || nothing} ${header}
        <slot name="dialog-header"></slot>
        ${content}
        <slot name="dialog-content"></slot>
        ${actions}
        <slot></slot>
        ${(this.open && this.renderFocusTrap("last")) || nothing}
      </dialog>
    `;
  }

  protected renderDefaultHeader(): TemplateResult {
    const hasHeader = this._hasHeader || this._hasTitle;
    return html`
      <mwc-dialog-header id=${this.headerId} ?hidden=${!hasHeader}>
        <slot name="icon" slot="icon"></slot>
        <mwc-dialog-title id=${this.titleId} ?hidden=${!this._hasTitle}>
          <slot name="title" @slotchange=${this.#handleTitleSlotChange}></slot>
        </mwc-dialog-title>
        <slot name="header" @slotchange=${this.#handleHeaderSlotChange}></slot>
      </mwc-dialog-header>
    `;
  }

  protected renderDefaultContent(): TemplateResult {
    return html`
      <mwc-dialog-content id=${this.contentId} ?hidden=${!this._hasContent}>
        <slot name="content" @slotchange=${this.#handleContentSlotChange}>
        </slot>
      </mwc-dialog-content>
    `;
  }

  protected renderDefaultActions(): TemplateResult {
    return html`
      <mwc-dialog-actions
        id=${this.actionsId}
        ?hidden=${!this._hasActions}
        align="end"
      >
        <slot name="actions" @slotchange=${this.#handleActionsSlotChange}>
        </slot>
      </mwc-dialog-actions>
    `;
  }

  // this is just added to provide the correct definitions
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
    if (this.type === "popover") {
      this._dialog?.showPopover();
    } else if (this.type === "fixed") {
      this._dialog?.show();
    } else {
      this._dialog?.showModal();
    }

    this.open = true;
    this._content?.scrollTo({ top: 0 });
    this.focusFirstAutoFocus();
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

  #handleRequestClose(event: Event): void {
    if (event.defaultPrevented) {
      return;
    }

    this.close();
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

  #handleHeaderSlotChange(event: Event): void {
    this._hasHeader = isSlotted(event);
  }

  #handleTitleSlotChange(event: Event): void {
    this._hasTitle = isSlotted(event);
  }

  #handleContentSlotChange(event: Event): void {
    this._hasContent = isSlotted(event);
  }

  #handleActionsSlotChange(event: Event): void {
    this._hasActions = isSlotted(event);
  }
}
