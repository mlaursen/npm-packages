import { kebabCase } from "@mlaursen/utils";
import type { Box, MaterialSymbol, Radio, TextField } from "@mlaursen/wc";

const form = document.querySelector("form");
const playgroundTarget = document.querySelector<Box>("#playground-target");
const startIcon = document.querySelector<MaterialSymbol>("#start-icon");
const startAvatar = document.querySelector<HTMLSpanElement>("#start-avatar");
const startImage = document.querySelector<HTMLSpanElement>("#start-image");
const startVideo = document.querySelector<HTMLSpanElement>("#start-video");
const items = [...(playgroundTarget?.querySelectorAll("mwc-list-item") ?? [])];

if (
  !form ||
  !playgroundTarget ||
  !startIcon ||
  !startAvatar ||
  !startImage ||
  !startVideo ||
  items.length === 0
) {
  throw new Error("Missing stuffs");
}

const _isTextField = (element: Element): element is TextField =>
  element.matches("mwc-text-field");
const isRadio = (element: Element): element is Radio =>
  element.matches("mwc-radio");

const ADORNMENT_TEMPLATES: Record<string, Element> = {
  icon: startIcon,
  avatar: startAvatar,
  image: startImage,
  video: startVideo,
};

const updateAdornments = (value: string): void => {
  const slot = ADORNMENT_TEMPLATES[value];
  for (const item of items) {
    const existingSlots = [...item.querySelectorAll("[slot]")];
    for (const slot of existingSlots) {
      slot.remove();
    }

    if (!slot) {
      continue;
    }

    const cloned = slot.cloneNode(true) as Element;
    cloned.slot = `start-${value}`;
    item.append(cloned);
  }
};

form.addEventListener("change", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (isRadio(event.target)) {
    const { value } = event.target;
    const name = kebabCase(event.target.name);

    if (name === "adornments") {
      updateAdornments(value);
    }
  }
});
