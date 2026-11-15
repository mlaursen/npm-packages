import type {
  PopoverInitiator,
  PopoverTargetProperties,
  PopoverType,
} from "../popover-target/types.js";

export interface TooltipProperties extends PopoverTargetProperties {
  /**
   * @defaultValue `"hint"`
   * @see {@link PopoverTargetProperties.popoverType}
   */
  popoverType: PopoverType;

  /**
   * @defaultValue `"no-click"`
   * @see {@link PopoverTargetProperties.popoverInitiator}
   */
  popoverInitiator: PopoverInitiator;

  /**
   * Set this to `true` to only show the tooltip when the content is overflown.
   *
   * @defaultValue `false`
   */
  overflowOnly: boolean;
}
