import {
  type PopoverBehavior,
  type PopoverProperties,
} from "../popover/types.js";

export interface TooltipProperties extends PopoverProperties {
  /**
   * @defaultValue `"hint"`
   */
  popoverBehavior: PopoverBehavior;
}
