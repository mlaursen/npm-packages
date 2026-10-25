import { kebabCase } from "@mlaursen/utils";
import {
  Checkbox,
  clamp,
  isCustomElement,
  Radio,
  TextField,
  type CircularProgress,
} from "@mlaursen/wc";

const form = document.querySelector("form");
const indeterminate = document.querySelector<Checkbox>(
  "mwc-checkbox[name=indeterminate]",
);
const valueField = document.querySelector<TextField>(
  "mwc-text-field[name=value]",
);
const editable = document.querySelector<CircularProgress>("#editable");
if (!form || !editable || !indeterminate || !valueField) {
  throw new Error("Missing stuff");
}

const syncValue = (): void => {
  if (indeterminate.checked) {
    editable.removeAttribute("value");
  } else {
    const value = Number.isFinite(valueField.valueAsNumber)
      ? valueField.value
      : "0";
    editable.setAttribute("value", value);
  }
};

form.addEventListener("change", (event) => {
  if (isCustomElement(event.target, Radio)) {
    editable.setAttribute(kebabCase(event.target.name), event.target.value);
  } else if (isCustomElement(event.target, Checkbox)) {
    const { name, checked } = event.target;
    editable.toggleAttribute(kebabCase(name), checked);
    syncValue();
  } else if (isCustomElement(event.target, TextField)) {
    let value = event.target.valueAsNumber;
    if (!Number.isFinite(value)) {
      value = 0;
    }

    const clamped = clamp({ value, max: 100, min: 0 }).toString();

    event.target.value = clamped;
    editable.setAttribute(event.target.name, clamped);
    indeterminate.removeAttribute("checked");
  }
});
