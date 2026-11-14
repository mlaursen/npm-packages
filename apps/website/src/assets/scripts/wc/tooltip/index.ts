import {
  Checkbox,
  isCustomElement,
  Radio,
  type PopoverPlacement,
  type Tooltip,
} from "@mlaursen/wc";

import { defaultPopoverPlacements } from "../../../../packages/wc/wc.11tydata.js";

const form = document.querySelector("form");
const tooltip = document.querySelector<Tooltip>("#tooltip");
if (!form || !tooltip) {
  throw new Error("Missing stuff");
}

function isPopoverPlacement(value: string): value is PopoverPlacement {
  return defaultPopoverPlacements.includes(value as PopoverPlacement);
}

form.addEventListener("change", (event) => {
  if (isCustomElement(event.target, Checkbox)) {
    tooltip.popoverArrow = event.target.checked;
  } else if (
    isCustomElement(event.target, Radio) &&
    isPopoverPlacement(event.target.value)
  ) {
    tooltip.placement = event.target.value;
  }
});
