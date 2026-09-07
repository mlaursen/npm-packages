import type { OverridableStringUnion } from "@mlaursen/utils";

import type { InteractionDirection } from "../interaction/types.js";
import type { PassThroughLinkProperties } from "../link/types.js";

export interface ListItemExampleOverrides {}
export type DefaultListItemExample = "a" | "b";
export type ListItemExample = OverridableStringUnion<
  DefaultListItemExample,
  ListItemExampleOverrides
>;

export interface ListItemProperties extends PassThroughLinkProperties {
  /**
   * Override to be inward since list item normally appear in a scrollable list
   * which will cut off the focus state.
   *
   * @override
   * @defaultValue `"inward"`
   */
  interaction?: InteractionDirection;
  disabled?: boolean;
  selected?: boolean;
}
