import { isCustomElement, Radio, type Switch } from "@mlaursen/wc";

const form = document.querySelector("form");
const switches = document.querySelectorAll<Switch>("mwc-switch");
if (!form || switches.length === 0) {
  throw new Error("Missing stuff");
}

form.addEventListener("change", (event) => {
  if (!isCustomElement(event.target, Radio)) {
    return;
  }

  for (const switchEl of switches) {
    switchEl.setAttribute("icons", event.target.value);
  }
});
