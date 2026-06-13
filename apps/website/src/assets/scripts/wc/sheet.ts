import { sheet as sheetSettings } from "../../../pages/packages/wc/wc.11tydata.js";

const button =
  document.querySelector<HTMLElementTagNameMap["mwc-button"]>("#show-sheet-1");
const sheet =
  document.querySelector<HTMLElementTagNameMap["mwc-sheet"]>("#sheet-1");
const togglePosition =
  document.querySelector<HTMLElementTagNameMap["mwc-button"]>(
    "#toggle-position",
  );

button?.addEventListener("click", () => {
  sheet?.show();
});

let positionIndex = 0;
togglePosition?.addEventListener("click", () => {
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
});
