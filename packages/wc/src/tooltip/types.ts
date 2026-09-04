import type {
  PopoverInitiator,
  PopoverProperties,
  PopoverType,
} from "../popover/types.js";

export interface TooltipProperties extends PopoverProperties {
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
}
