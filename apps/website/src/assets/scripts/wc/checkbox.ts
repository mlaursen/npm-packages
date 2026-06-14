import type { Checkbox } from "@mlaursen/wc";

const checkboxes = document.querySelectorAll<Checkbox>(
  "mwc-checkbox[indeterminate]",
);

for (const checkbox of checkboxes) {
  let forceIndeterminate = false;
  checkbox.addEventListener("change", () => {
    if (checkbox.checked && forceIndeterminate) {
      // checkbox.checked = false;
      checkbox.indeterminate = true;
      forceIndeterminate = false;
    } else if (!checkbox.checked) {
      forceIndeterminate = true;
    }
  });
}
