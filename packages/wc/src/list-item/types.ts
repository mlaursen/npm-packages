import type {
  InteractionDirection,
  InteractionProperties,
} from "../interaction/types.js";
import type { PassThroughLinkProperties } from "../link/types.js";

export interface ListItemProperties
  extends PassThroughLinkProperties, InteractionProperties {
  /**
   * Override to be inward since list item normally appear in a scrollable list
   * which will cut off the focus state.
   *
   * @override
   * @defaultValue `"inward"`
   */
  interaction: InteractionDirection;

  /**
   * @defaultValue `false`
   */
  selected: boolean;
}
