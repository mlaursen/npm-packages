import { clamp, kebabCase, wait } from "@mlaursen/utils";
import type { Button, LinearProgress } from "@mlaursen/wc";
import {
  Checkbox,
  DEFAULT_TOAST_TIMEOUT,
  isCustomElement,
  Radio,
  TextField,
  type Toast,
} from "@mlaursen/wc";

const form = document.querySelector("form");
const showButton = document.querySelector<Button>("#show");
const hideButton = document.querySelector<Button>("#hide");
const toast = document.querySelector<Toast>("#toast");
const timeout = document.querySelector<TextField>("[name=timeout]");
const manual = document.querySelector<Checkbox>("mwc-checkbox[name=manual]");
const countdown = document.querySelector<LinearProgress>("#countdown");
if (
  !form ||
  !toast ||
  !showButton ||
  !hideButton ||
  !manual ||
  !timeout ||
  !countdown
) {
  throw new Error("Missing stuff");
}

toast.addEventListener("async-click", (event) => {
  event.waitUntil(wait(3000));
});
toast.addEventListener("open", () => {
  showButton.disabled = true;
  hideButton.disabled = false;
});
toast.addEventListener("opened", () => {
  if (manual.checked) {
    return;
  }

  countdown.toggleAttribute("hidden", false);
  countdown.classList.add("animate");
});
toast.addEventListener("closed", () => {
  showButton.disabled = false;
  hideButton.disabled = true;
  countdown.toggleAttribute("hidden", true);
  countdown.classList.remove("animate");
});
toast.addEventListener("toast-state-change", (event) => {
  if (countdown.hidden) {
    return;
  }

  countdown.classList.toggle("paused", event.state === "paused");
});

const handleManual = (checked: boolean): void => {
  timeout.disabled = checked;
  if (checked) {
    toast.timeout = null;
  } else {
    const value = timeout.valueAsNumber;
    if (Number.isNaN(value)) {
      toast.timeout = DEFAULT_TOAST_TIMEOUT;
    } else {
      toast.timeout = clamp({
        min: 0,
        max: 20_000,
        value,
      });
    }
  }
};

function isBooleanProp(name: string): name is "closeButton" {
  return ["closeButton"].includes(name);
}

const updateContent = (value: string): void => {
  const textNode = [...toast.childNodes].find(
    (node): node is Text => node.nodeType === Node.TEXT_NODE,
  );
  if (textNode) {
    textNode.data = value;
  }
};

const updateAction = (value: string): void => {
  const actionNode = [...toast.childNodes].find(
    (node): node is HTMLDivElement =>
      node instanceof HTMLDivElement && node.slot === "action",
  );
  if (!value) {
    actionNode?.remove();
    return;
  }

  const text = document.createTextNode(value);
  if (actionNode) {
    actionNode.replaceChildren(text);
  } else {
    const node = document.createElement("div");
    node.setAttribute("slot", "action");
    node.append(text);
    toast.append(node);
  }
};

form.addEventListener("change", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (isCustomElement(event.target, TextField)) {
    if (event.target.name === "content") {
      updateContent(event.target.value);
      return;
    }

    if (event.target.name === "action") {
      updateAction(event.target.value);
      return;
    }

    const value = event.target.valueAsNumber;
    if (Number.isNaN(value) || value < 0) {
      return;
    }

    toast.timeout = value === 0 ? null : value;
  } else if (isCustomElement(event.target, Radio)) {
    const { value } = event.target;
    const name = kebabCase(event.target.name);

    // @ts-expect-error don't care about validating
    toast[name] = value;
  } else if (isCustomElement(event.target, Checkbox)) {
    if (event.target.name === "manual") {
      handleManual(event.target.checked);
      return;
    }

    const { name } = event.target;
    if (isBooleanProp(name)) {
      toast[name] = event.target.checked;
    }
  }
});
