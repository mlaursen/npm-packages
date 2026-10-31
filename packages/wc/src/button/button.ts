import { spread } from "@open-wc/lit-helpers";
import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
import { property, query } from "lit/decorators.js";

import { DelegateAriaMixin } from "../delegate-aria-mixin/delegate-aria-mixin.js";
import { ElevationMixin } from "../elevation/elevation-mixin.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { InternalsMixin } from "../internals-mixin/internals-mixin.js";
import { PASS_THROUGH_LINK_PROPS } from "../link/constants.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import type { CommandAttribute, PopoverTargetAction } from "../types.js";
import styles from "./button-styles.js";
import type {
  ButtonProperties,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "./types.js";

const BaseStyledButton = ElevationMixin(
  InteractionMixin(PaletteMixin(MarginMixin(LitElement))),
);
const BaseButton = DelegateAriaMixin(InternalsMixin(BaseStyledButton));

const INVALID_LINK_TYPES = new Set(["button", "submit", "reset"]);
const PASS_THROUGH_BUTTON_PROPS = [
  "name",
  "command",
  "formAction",
  "formEnctype",
  "formMethod",
  "formTarget",
  "value",
] as const satisfies (keyof HTMLButtonElement | "command")[];

/**
 * This example will use the default styling of a small, round, and filled
 * button:
 *
 * @example Default Example
```html
<mwc-button>Button</mwc-button>
```
 *
 * This example showcases the default variants allowed for the button. This can
 * further be customiZed by providing a `size` and `shape`:
 *
 * @example Using Variants
```html
<mwc-button variant="tonal">Tonal</mwc-button>
<mwc-button variant="text">Text</mwc-button>
<mwc-button variant="outlined">Outlined</mwc-button>
<mwc-button variant="filled">Filled</mwc-button>
<mwc-button variant="elevated">Elevated</mwc-button>
```
 *
 * If the button should be rendered as a link but maintain the default button
 * styles, provide an `href`:
 *
 * @see ButtonLinkProperties for supported properties
 * @example Link Button
```html
<mwc-button href="https://example.com">I am now a link</mwc-button>
```
 *
 * This example shows how you can have an icon with spacing between the main
 * content:
 *
 * @example Button with icon
```html
<mwc-button>
  <mwc-material-symbol>favorite</mwc-material-symbol>
  Favorite Button
</mwc-button>
<mwc-button>
  Favorite Button
  <mwc-material-symbol>favorite</mwc-material-symbol>
</mwc-button>
<mwc-button>
  <mwc-material-symbol>favorite</mwc-material-symbol>
  Love
  <mwc-material-symbol>favorite</mwc-material-symbol>
</mwc-button>
```
 *
 * @slot - The default slot for the content to display. The button
 * automatically applies gap between items so just place content as desired and
 * there will be spacing between.
 */
export class Button extends BaseButton implements ButtonProperties {
  static override styles = [...BaseButton.styles, styles];
  static formAssociated = true;
  static override shadowRootOptions: ShadowRootInit = {
    ...BaseButton.shadowRootOptions,
    delegatesFocus: true,
  };
  static readonly elementName: string = "mwc-button";

  @query("button")
  _button?: HTMLButtonElement;

  @query("a")
  _link?: HTMLAnchorElement;

  protected override get delegateAriaTarget(): HTMLElement | null {
    return this._button ?? this._link ?? null;
  }

  @property()
  name = "";

  @property()
  type: HTMLButtonElement["type"] = "submit";

  @property({ reflect: true })
  size: ButtonSize = "small";

  @property({ reflect: true })
  shape: ButtonShape = "round";

  @property({ reflect: true })
  variant: ButtonVariant = "filled";

  @property()
  command: CommandAttribute | "" = "";

  @property({ attribute: "commandfor" })
  commandFor = "";

  @property({ attribute: false })
  commandForElement: Element | null = null;

  @property({ attribute: "popovertarget" })
  popoverTarget = "";

  @property({ attribute: "popovertargetaction" })
  popoverTargetAction: PopoverTargetAction = "toggle";

  @property({ attribute: false })
  popoverTargetElement: Element | null = null;

  @property({ attribute: "formaction" })
  formAction = "";

  @property({ attribute: "formenctype" })
  formEnctype: HTMLButtonElement["formEnctype"] = "";

  @property({ attribute: "formmethod" })
  formMethod: HTMLButtonElement["formMethod"] = "";

  @property({ type: Boolean, attribute: "formnovalidate" })
  formNoValidate = false;

  @property({ attribute: "formtarget" })
  formTarget = "";

  @property()
  value = "";

  // link only properties
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

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("click", this.handleClick, { capture: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("click", this.handleClick, { capture: true });
  }

  override render(): TemplateResult {
    if (this.href) {
      return this.renderLink();
    }

    return this.renderButton();
  }

  protected renderContent(): TemplateResult {
    return html`<slot></slot>${this._renderStateLayer()}`;
  }

  protected renderButton(): TemplateResult {
    const props: Record<string, string> = {};
    for (const name of PASS_THROUGH_BUTTON_PROPS) {
      const value = this[name];
      if (value) {
        props[name.toLowerCase()] = value;
      }
    }

    if (this.hasAttribute("popovertargetaction")) {
      props.popovertargetaction = this.popoverTargetAction;
    }

    return html`<button
      class="button elevation"
      type=${this.type}
      ?disabled=${this.disabled}
      @focus=${this._updateFocusVisible}
      @blur=${this._updateFocusVisible}
      ${spread(props)}
      ?formnovalidate=${this.formNoValidate}
      .commandForElement=${this.commandForElement}
      .popoverTargetElement=${this.popoverTargetElement}
    >
      ${this.renderContent()}
    </button>`;
  }

  protected renderLink(): TemplateResult {
    const props: Record<string, string> = {};
    for (const name of PASS_THROUGH_LINK_PROPS) {
      const value = this[name];
      if (
        value !== undefined &&
        (name !== "type" || INVALID_LINK_TYPES.has(value))
      ) {
        props[name] = value;
      }
    }

    return html`<a
      class="button elevation"
      ${spread(props)}
      @focus=${this._updateFocusVisible}
      @blur=${this._updateFocusVisible}
      >${this.renderContent()}</a
    >`;
  }

  override focus(options?: FocusOptions): void {
    this._button?.focus(options);
  }

  override blur(): void {
    this._button?.blur();
  }

  protected handleClick(event: MouseEvent): void {
    if (this.dataset.ariaDisabled === "true" || (this.href && this.disabled)) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return;
    }

    const button = this._button;
    if (!button) {
      return;
    }

    this.#resolveTargetElements(button);
    this.#resolveFormAction();
  }

  #resolveFormAction(): void {
    const form = this.form;
    if (!form || this.type === "button") {
      return;
    }

    if (this.type === "reset") {
      form.reset();
      return;
    }

    // See https://github.com/WICG/webcomponents/issues/814
    form.addEventListener(
      "submit",
      (event: SubmitEvent) => {
        Object.defineProperty(event, "submitter", {
          configurable: true,
          enumerable: true,
          get: () => this,
        });
      },
      { capture: true, once: true },
    );

    this.internals.setFormValue(this.value ?? "");
    if (this.formNoValidate) {
      const prevNoValidate = form.noValidate;
      form.noValidate = true;
      form.requestSubmit();
      form.noValidate = prevNoValidate;
    } else {
      form.requestSubmit();
    }
  }

  /**
   * Need to manually resolve the `commandfor` and `popovertarget` id refs since
   * they do not work cross shadow boundaries.
   */
  #resolveTargetElements(button: HTMLButtonElement): void {
    const root = this.getRootNode() as Document | ShadowRoot;
    if (
      this.commandFor &&
      !this.commandForElement &&
      !button.commandForElement
    ) {
      // oxlint-disable-next-line unicorn/prefer-query-selector
      button.commandForElement = root.getElementById(this.commandFor);
    }
    if (
      this.popoverTarget &&
      !this.popoverTargetElement &&
      !button.popoverTargetElement
    ) {
      // oxlint-disable-next-line unicorn/prefer-query-selector
      button.popoverTargetElement = document.getElementById(this.popoverTarget);
    }
  }
}
