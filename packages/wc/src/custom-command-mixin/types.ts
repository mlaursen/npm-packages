import type { LitConstructor } from "../types.js";

export type LitConstructorWithCustomCommandProperties = LitConstructor & {
  show?(): void;
  close?(value?: string): void;
  requestClose?(value?: string): void;
};

/**
 * CommandEvent isn't in type definitions yet
 */
export type CommandEventType = Event & {
  command: string;
  source: Element | null;
};

export interface CustomCommandProperties {
  /**
   * Need to register custom commands for showing and closing since the browser
   * does not trigger the default `showModal()` unless it is the `dialog`
   * element.
   */
  handleCommand(event: CommandEventType): void;
}
