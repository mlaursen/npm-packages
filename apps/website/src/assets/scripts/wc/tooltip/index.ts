import type { Checkbox, Tooltip } from "@mlaursen/wc";

const form = document.querySelector("form");
const tooltips = document.querySelectorAll<Tooltip>(
  "#tooltips-playground mwc-tooltip",
);
if (!form || tooltips.length === 0) {
  throw new Error("Missing stuff");
}

function isCheckbox(target: EventTarget | null): target is Checkbox {
  return (
    target instanceof Element && target.matches("mwc-checkbox[name=arrow]")
  );
}

form.addEventListener("change", (event) => {
  if (!isCheckbox(event.target)) {
    return;
  }

  for (const tooltip of tooltips) {
    tooltip.toggleAttribute("popover-arrow", event.target.checked);
  }
});
