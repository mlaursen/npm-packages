export type InteractionDirection = "inward" | "outward";
export interface InteractionProperties {
  interaction?: InteractionDirection;

  /**
   * This is an overridable class property that can be used to find a focusable
   * element for interaction targets. This is really only required when using a
   * `<slot>` that contains the focusable element itself
   */
  focusTarget?: Element | null;
}
