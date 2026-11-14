import type { Button, Typography } from "@mlaursen/wc";
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
const button = document.querySelector<Button>("#button");
const overflownText = document.querySelector<Typography>("#overflown-text");
if (!form || !tooltip || !button || !overflownText) {
  throw new Error("Missing stuff");
}

function isPopoverPlacement(value: string): value is PopoverPlacement {
  return defaultPopoverPlacements.includes(value as PopoverPlacement);
}

function isBooleanProperty(
  name: string,
): name is "popoverArrow" | "overflowOnly" {
  return ["popoverArrow", "overflowOnly"].includes(name);
}

form.addEventListener("change", (event) => {
  if (isCustomElement(event.target, Checkbox)) {
    if (isBooleanProperty(event.target.name)) {
      tooltip[event.target.name] = event.target.checked;
    } else if (event.target.name === "buttonOverflow") {
      if (event.target.checked) {
        button.hidden = true;
        overflownText.hidden = false;
      } else {
        button.hidden = false;
        overflownText.hidden = true;
      }
    }
  } else if (
    isCustomElement(event.target, Radio) &&
    isPopoverPlacement(event.target.value)
  ) {
    tooltip.placement = event.target.value;
  }
});
