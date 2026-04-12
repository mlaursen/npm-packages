export type InteractionDirection = "inward" | "outward";

export interface InteractionProperties {
  interaction?: InteractionDirection;

  disabled?: boolean;
}
