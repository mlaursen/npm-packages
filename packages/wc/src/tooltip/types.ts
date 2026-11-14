import type { MarginProperties } from "../margin/types.js";
import type {
  PopoverInitiator,
  PopoverProperties,
  PopoverType,
} from "../popover/types.js";

export interface TooltipProperties extends MarginProperties, PopoverProperties {
  /**
   * @defaultValue `"hint"`
   * @see {@link PopoverProperties.popoverType}
   */
  popoverType: PopoverType;

  /**
   * @defaultValue `"no-click"`
   * @see {@link PopoverProperties.popoverInitiator}
   */
  popoverInitiator: PopoverInitiator;

  /**
   * Set this to `true` to only show the tooltip when the content is overflown.
   *
   * @defaultValue `false`
   */
  overflowOnly: boolean;
}
