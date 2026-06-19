import {
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
} from "lit";
import { customElement, property } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import "../elevation/elevation.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";
import { PASS_THROUGH_LINK_PROPS } from "../link/constants.js";
import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./button-styles.js";
import {
  type ButtonProperties,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
  type CommandAttribute,
  type PopoverTargetAction,
} from "./types.js";

const BaseStyledButton = InteractionMixin(
  PaletteMixin(MarginMixin(LitElement)),
);
const BaseButton = AriaMixin(BaseStyledButton, "button");

const INVALID_LINK_TYPES = new Set(["button", "submit", "reset"]);

// CommandEvent doesn't exist in typescript yet
interface CommandEventInit extends EventInit {
  command: string;
  source?: Element;
}

interface CommandEvent extends Event {
  readonly command: string;
  readonly source: Element | null;
}

declare const CommandEvent: {
  new (type: string, eventInitDict: CommandEventInit): CommandEvent;
  prototype: CommandEvent;
};

@customElement("mwc-button")
export class Button extends BaseButton implements ButtonProperties {
  static override styles = [...BaseButton.styles, styles];

  @property()
  type: HTMLButtonElement["type"] = "submit";

  @property({ reflect: true })
  size: ButtonSize = "small";

  @property({ reflect: true })
  shape: ButtonShape = "round";

  @property({ reflect: true })
  variant: ButtonVariant = "filled";

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

  @property()
  command?: CommandAttribute;

  @property()
  commandfor?: string;

  @property()
  popovertarget?: string;

  @property()
  popovertargetaction?: PopoverTargetAction;

  @property()
  value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.internals) {
      return;
    }

    // I do not support adding an href later
    if (this.href) {
      this.role = "link";
      this.internals.role = "link";
      this.addEventListener("auxclick", this.#handleMiddleClick);
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);

    if (changed.has("value") && this.value && this.internals) {
      this.internals.setFormValue(this.value);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("auxclick", this.#handleMiddleClick);
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <mwc-elevation></mwc-elevation>
      ${this._renderStateLayer()} ${this._renderRipple()}
    `;
  }

  override handleClick(event: MouseEvent): void {
    super.handleClick(event);

    if (this.href) {
      this.#clickLink(event.ctrlKey);
      return;
    }

    if (this.#tryPopoverApi() || this.#tryCommandApi()) {
      return;
    }

    const internals = this.internals;
    const form = internals?.form;
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

    internals.setFormValue(this.value ?? "");
    form.requestSubmit();
  }

  #clickLink(forceNewTab = false): void {
    const link = document.createElement("a");
    for (const name of PASS_THROUGH_LINK_PROPS) {
      const value = this[name];
      if (
        value !== undefined &&
        (name !== "type" || INVALID_LINK_TYPES.has(value))
      ) {
        link[name] = value;
      }
    }

    if (forceNewTab) {
      link.target = "_blank";
    }

    link.click();
  }

  #handleMiddleClick(event: MouseEvent): void {
    if (event.button === 1) {
      event.preventDefault();
      this.#clickLink(true);
    }
  }

  #tryCommandApi(): boolean {
    if (!this.command || !this.commandfor) {
      return false;
    }

    const target = document.querySelector<HTMLElement>(`#${this.commandfor}`);
    if (!target) {
      return false;
    }

    if (this.command.startsWith("--") && CommandEvent !== undefined) {
      target.dispatchEvent(
        new CommandEvent("command", { command: this.command, source: this }),
      );
      return true;
    }

    switch (this.command) {
      case "show-modal":
        if ("showModal" in target && typeof target.showModal === "function") {
          target.showModal();
          return true;
        }
        break;
      case "request-close":
        if (
          "requestClose" in target &&
          typeof target.requestClose === "function"
        ) {
          target.requestClose(this.value);
          return true;
        }
        break;
      case "close":
        if ("close" in target && typeof target.close === "function") {
          target.close(this.value);
          return true;
        }
        break;
      case "show-popover":
        target.showPopover();
        return true;
      case "hide-popover":
        target.hidePopover();
        return true;
      case "toggle-popover":
        target.togglePopover();
        return true;
    }

    return false;
  }

  #tryPopoverApi(): boolean {
    if (!this.popovertarget || !this.popovertargetaction) {
      return false;
    }

    const popover = document.querySelector<HTMLElement>(
      `#${this.popovertarget}`,
    );
    if (!popover?.showPopover) {
      return false;
    }

    switch (this.popovertargetaction) {
      case "show":
        popover.showPopover();
        return true;
      case "hide":
        popover.hidePopover();
        return true;
      case "toggle":
        popover.togglePopover();
        return true;
    }

    return false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-button": Button;
  }
}
