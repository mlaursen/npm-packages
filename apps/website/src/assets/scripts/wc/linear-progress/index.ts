import { clamp } from "@mlaursen/utils";
import {
  Checkbox,
  isCustomElement,
  Radio,
  TextField,
  type LinearProgress,
} from "@mlaursen/wc";

const form = document.querySelector("form");
const indeterminate = document.querySelector<Checkbox>(
  "mwc-checkbox[name=indeterminate]",
);
const valueField = document.querySelector<TextField>(
  "mwc-text-field[name=value]",
);
const editable = document.querySelector<LinearProgress>("#editable");
if (!form || !editable || !indeterminate || !valueField) {
  throw new Error("Missing stuff");
}

const syncValue = (checked: boolean): void => {
  if (checked) {
    editable.removeAttribute("value");
  } else {
    const value = Number.isFinite(valueField.valueAsNumber)
      ? valueField.value
      : "0";
    editable.setAttribute("value", value);
  }
};

const BOOLEAN_KEYS = [
  "reversed",
  "paused",
  "disableGap",
  "disableTransition",
] as const;

function isBooleanAttribute(
  name: string,
): name is (typeof BOOLEAN_KEYS)[number] {
  return BOOLEAN_KEYS.includes(name as "reversed");
}

form.addEventListener("change", (event) => {
  if (isCustomElement(event.target, Radio)) {
    editable.setAttribute(event.target.name, event.target.value);
  } else if (isCustomElement(event.target, Checkbox)) {
    const { name, checked } = event.target;
    if (name === "vertical") {
      editable.ariaOrientation = checked ? "vertical" : "horizontal";
    } else if (name === "indeterminate") {
      syncValue(checked);
    } else if (name === "stopIndicator") {
      editable.stopIndicator = checked ? "visible" : "hidden";
    } else if (isBooleanAttribute(name)) {
      editable[name] = checked;
    }
  } else if (isCustomElement(event.target, TextField)) {
    let value = event.target.valueAsNumber;
    if (!Number.isFinite(value)) {
      value = 0;
    }

    const clamped = clamp({ value, max: 100, min: 0 }).toString();

    event.target.value = `${clamped}`;
    editable.setAttribute(event.target.name, clamped);
    indeterminate.checked = false;
  }
});
