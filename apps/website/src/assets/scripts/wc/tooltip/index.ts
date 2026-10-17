import { Checkbox, isCustomElement, type Tooltip } from "@mlaursen/wc";

const form = document.querySelector("form");
const tooltips = document.querySelectorAll<Tooltip>(
  "#tooltips-playground mwc-tooltip",
);
if (!form || tooltips.length === 0) {
  throw new Error("Missing stuff");
}

form.addEventListener("change", (event) => {
  if (!isCustomElement(event.target, Checkbox)) {
    return;
  }

  for (const tooltip of tooltips) {
    tooltip.toggleAttribute("popover-arrow", event.target.checked);
  }
});
