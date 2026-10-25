import { wait } from "@mlaursen/utils";
import {
  isCustomElement,
  type AsyncButton,
  Checkbox,
  Radio,
} from "@mlaursen/wc";

const form = document.querySelector("form");
const buttons = document.querySelectorAll<AsyncButton>("mwc-async-button");
const pendingCheckbox = document.querySelector<Checkbox>(
  "mwc-checkbox[name=pending]",
);
if (!form || buttons.length === 0 || !pendingCheckbox) {
  throw new Error("Missing stuff");
}

for (const button of buttons) {
  button.addEventListener("async-click", (event) => {
    event.waitUntil(wait(4000));
  });
}

form.addEventListener("change", (event) => {
  if (isCustomElement(event.target, Checkbox)) {
    for (const button of buttons) {
      button.toggleAttribute("pending", pendingCheckbox.checked);
    }
  } else if (isCustomElement(event.target, Radio)) {
    const { name, value } = event.target;
    const isNull = value === "null";
    for (const button of buttons) {
      if (isNull) {
        button.removeAttribute(name);
      } else {
        button.setAttribute(name, value);
      }
    }
  }
});
