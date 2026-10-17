import { isCustomElement, Radio } from "@mlaursen/wc";

const form = document.querySelector("form");
const objectFits = document.querySelectorAll("mwc-object-fit");
if (!form || objectFits.length === 0) {
  throw new Error("Missing stuff");
}

document.body.style.setProperty("--object-fit", "contain");
for (const el of objectFits) {
  el.style.setProperty("--mwc-object-fit", "var(--object-fit)");
}

form.addEventListener("change", (event) => {
  if (!isCustomElement(event.target, Radio)) {
    return;
  }

  document.body.style.setProperty("--object-fit", event.target.value);
});
