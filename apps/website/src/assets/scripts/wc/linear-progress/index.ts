// oxlint-disable no-use-before-define
import { kebabCase } from "@mlaursen/utils";
import {
  Checkbox,
  clamp,
  isCustomElement,
  Radio,
  TextField,
  type LinearProgress,
} from "@mlaursen/wc";

const form = document.querySelector("form");
const editable = document.querySelector<LinearProgress>("#editable");
if (!form || !editable) {
  throw new Error("Missing stuff");
}

form.addEventListener("change", (event) => {
  if (isCustomElement(event.target, Radio)) {
    editable.setAttribute(event.target.name, event.target.value);
  } else if (isCustomElement(event.target, Checkbox)) {
    if (event.target.name === "vertical") {
      editable.setAttribute(
        "aria-orientation",
        event.target.checked ? "vertical" : "horizontal",
      );
    } else {
      editable.toggleAttribute(
        kebabCase(event.target.name),
        event.target.checked,
      );
    }
  } else if (isCustomElement(event.target, TextField)) {
    const value = event.target.valueAsNumber;
    const isZeroOrNaN = value === 0 || Number.isNaN(value);
    if (isZeroOrNaN) {
      editable.removeAttribute(event.target.name);
      event.target.value = "0";

      return;
    }

    const clamped = clamp({ value, max: 100, min: 0 }).toString();

    editable.setAttribute(event.target.name, clamped);
    event.target.value = `${clamped}`;
  }
});
