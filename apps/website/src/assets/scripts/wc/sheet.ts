import type { Button, Sheet } from "@mlaursen/wc";

import { sheet as sheetSettings } from "../../../packages/wc/wc.11tydata.js";

const button = document.querySelector<Button>("#show-sheet-1");
const sheet = document.querySelector<Sheet>("#sheet-1");
const togglePosition = document.querySelector<Button>("#toggle-position");
const toggleVariant = document.querySelector<Button>("#toggle-variant");
const toggleShape = document.querySelector<Button>("#toggle-shape");

const position = document.querySelector("#position");
const variant = document.querySelector("#variant");
const shape = document.querySelector("#shape");
if (
  !button ||
  !sheet ||
  !togglePosition ||
  !toggleVariant ||
  !toggleShape ||
  !position ||
  !variant ||
  !shape
) {
  throw new Error("missing nodes");
}

button.addEventListener("click", () => {
  sheet.show();
});

let positionIndex = sheetSettings.positions.indexOf(sheet.position);
togglePosition.addEventListener("click", () => {
  if (!sheet) {
    return;
  }

  let next = sheetSettings.positions[++positionIndex];
  if (!next) {
    positionIndex = 0;
    next = sheetSettings.positions[positionIndex];
  }

  if (!next) {
    return;
  }

  sheet.position = next;
  position.textContent = next;
});

let variantIndex = sheetSettings.variants.indexOf(sheet.variant);
toggleVariant.addEventListener("click", () => {
  if (!sheet) {
    return;
  }

  let next = sheetSettings.variants[++variantIndex];
  if (!next) {
    variantIndex = 0;
    next = sheetSettings.variants[variantIndex];
  }

  if (!next) {
    return;
  }

  sheet.variant = next;
  variant.textContent = next;
});

let shapeIndex = sheetSettings.shapes.indexOf(sheet.shape);
toggleShape.addEventListener("click", () => {
  if (!sheet) {
    return;
  }

  let next = sheetSettings.shapes[++shapeIndex];
  if (!next) {
    shapeIndex = 0;
    next = sheetSettings.shapes[shapeIndex];
  }

  if (!next) {
    return;
  }

  sheet.shape = next;
  shape.textContent = next;
});
