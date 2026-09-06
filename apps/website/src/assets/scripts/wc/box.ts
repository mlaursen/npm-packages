import { kebabCase } from "@mlaursen/utils";
import type { Box, Card } from "@mlaursen/wc";
import type { Checkbox, Radio, TextField } from "@mlaursen/wc";

const form = document.querySelector("form");
const playgroundTarget = document.querySelector<Box>("#playground-target");
const cardTemplate = playgroundTarget?.querySelector<Card>("mwc-card");
const itemPrefix = (cardTemplate
  ?.querySelector("p")
  ?.textContent.match(/([^0-9]+)/) ?? [])[0];
const [, gridTrueRadio] = document.querySelectorAll<Radio>(
  "mwc-radio[name=grid]",
);
const stacked = document.querySelector<Checkbox>("mwc-checkbox[name=stacked]");
const stackedTypography = stacked?.closest("mwc-typography");
const reversed = document.querySelector<Checkbox>(
  "mwc-checkbox[name=reversed]",
);
const reversedTypography = reversed?.closest("mwc-typography");
const nowrap = document.querySelector<Checkbox>("mwc-checkbox[name=nowrap]");
const nowrapTypography = nowrap?.closest("mwc-typography");
const items = document.querySelector<TextField>("mwc-text-field[name=items]");
const columns = document.querySelector<TextField>(
  "mwc-text-field[name=columns]",
);
if (
  !form ||
  !playgroundTarget ||
  !cardTemplate ||
  !itemPrefix ||
  !items ||
  !gridTrueRadio ||
  !columns ||
  !stacked ||
  !stackedTypography ||
  !reversed ||
  !reversedTypography ||
  !nowrap ||
  !nowrapTypography
) {
  throw new Error("Missing stuff");
}

const disabledGridCheckboxes = [stacked, reversed, nowrap];
const disabledGridTypography = [
  stackedTypography,
  reversedTypography,
  nowrapTypography,
];

const createCard = (i: number): Node => {
  const cloned = cardTemplate.cloneNode(true) as Card;
  const p = cloned.firstElementChild?.firstElementChild;
  if (p) {
    p.textContent = `${itemPrefix} ${i + 1}`;
  }

  if (i === 1) {
    cloned.style.height = "12rem";
  }

  return cloned;
};

const isTextField = (element: Element): element is TextField =>
  element.matches("mwc-text-field");
const isRadio = (element: Element): element is Radio =>
  element.matches("mwc-radio");
const isCheckbox = (element: Element): element is Checkbox =>
  element.matches("mwc-checkbox");

const forceTwoItems = (): void => {
  items.valueAsNumber = 2;
  items.dispatchEvent(new Event("change", { bubbles: true }));
};

const setNumberOfCards = (value: number): void => {
  const cards = [...playgroundTarget.querySelectorAll("mwc-card")];
  const totalCards = cards.length;
  if (totalCards === value) {
    return;
  }

  if (cards.length < value) {
    for (let i = 0; i < value - totalCards; i += 1) {
      playgroundTarget.append(createCard(totalCards + i));
    }
  } else {
    for (let i = 0; i < totalCards - value; i += 1) {
      playgroundTarget.lastElementChild?.remove();
    }
  }
};

form.addEventListener("change", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (isTextField(event.target)) {
    const value = event.target.valueAsNumber;
    if (Number.isNaN(value) || value <= 0) {
      return;
    }

    if (event.target.name === "columns") {
      if (!gridTrueRadio.checked) {
        gridTrueRadio.setAttribute("checked", "");
        gridTrueRadio.dispatchEvent(new Event("change", { bubbles: true }));
      }
      playgroundTarget.setAttribute("grid", event.target.value);
      return;
    }

    setNumberOfCards(value);
  } else if (isRadio(event.target)) {
    const { value } = event.target;
    const name = kebabCase(event.target.name);

    if (name === "grid") {
      if (event.target !== gridTrueRadio) {
        columns.value = "";
        columns.dispatchEvent(new Event("change", { bubbles: true }));
      }

      const disabled = value !== "false";
      for (const checkbox of disabledGridCheckboxes) {
        if (disabled) {
          checkbox.setAttribute("disabled", "");
        } else {
          checkbox.removeAttribute("disabled");
        }
      }

      for (const typography of disabledGridTypography) {
        // TODO: I need to create `text-disabled`, `text-secondary`, `text-hint`, etc color variants
        if (disabled) {
          const color =
            "var(--mwc-on-surface, light-dark(var(--mwc-light-on-surface), var(--mwc-dark-on-surface)))";
          typography.style.color = `rgb(from ${color} r g b / 0.38)`;
          // typography.setAttribute("color", "surface");
        } else {
          typography.removeAttribute("style");
          // typography.removeAttribute("color");
        }
      }

      if (value === "fit") {
        forceTwoItems();
      }
    }

    if (value === "true") {
      playgroundTarget.setAttribute(name, "");
    } else if (value === "false") {
      playgroundTarget.removeAttribute(name);
    } else {
      playgroundTarget.setAttribute(name, value);
    }
  } else if (isCheckbox(event.target)) {
    const name = kebabCase(event.target.name);
    if (event.target.checked) {
      playgroundTarget.setAttribute(name, "");
      if (name === "inline") {
        forceTwoItems();
      }
    } else {
      playgroundTarget.removeAttribute(name);
    }
  }
});
