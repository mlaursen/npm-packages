export type InteractionDirection = "inward" | "outward";

export interface InteractionProperties {
  disabled: boolean;
  interaction: InteractionDirection;
}
