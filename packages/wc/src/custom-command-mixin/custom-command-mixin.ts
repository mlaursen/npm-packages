import type { LitConstructor } from "../types.js";
import type {
  CommandEventType,
  CustomCommandProperties,
  LitConstructorWithCustomCommandProperties,
} from "./types.js";

/**
 * The `CustomCommandMixin` is used to handle when a button has `command` and
 * `commandfor` targeting the id of the base class. The browser does not trigger
 * the default `showModal` if the element is not a `dialog`. The same goes for
 * `show-popover`/`hide-popover` if the popover element is not the `:host`
 */
export function CustomCommandMixin<
  T extends LitConstructorWithCustomCommandProperties,
>(Base: T): T & LitConstructor<CustomCommandProperties> {
  class CustomCommandLitElement
    extends Base
    implements CustomCommandProperties
  {
    override connectedCallback(): void {
      super.connectedCallback();

      this.addEventListener("command", this.#handleCommand);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.removeEventListener("command", this.#handleCommand);
    }

    #handleCommand(event: Event): void {
      this.handleCommand(event as CommandEventType);
    }

    handleCommand(event: CommandEventType): void {
      const { command, source } = event;
      switch (command) {
        case "--show":
        case "--show-modal":
        case "--show-popover":
          if ("show" in this && typeof this.show === "function") {
            this.show();
          }
          break;
        case "--close":
          if ("close" in this && typeof this.close === "function") {
            this.close(
              source instanceof HTMLButtonElement ? source.value : undefined,
            );
          }
          break;
        case "--request-close":
          if (
            "requestClose" in this &&
            typeof this.requestClose === "function"
          ) {
            this.requestClose(
              source instanceof HTMLButtonElement ? source.value : undefined,
            );
          }
          break;
        case "--hide-popover":
          if ("close" in this && typeof this.close === "function") {
            this.close();
          }
          break;
      }
    }
  }

  return CustomCommandLitElement;
}
