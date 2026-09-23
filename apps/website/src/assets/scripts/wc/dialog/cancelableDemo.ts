/** @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/requestClose#using_requestclose */

import type { Button, Checkbox, Dialog } from "@mlaursen/wc";

const showButton = document.querySelector<Button>("#cancelable-dialog-button");
const requestCloseCheckbox = document.querySelector<Checkbox>(
  "#cancelable-dialog-request-close",
);
const dialog = document.querySelector<Dialog>("#cancelable-dialog");
const [closeButton, closeWithValueButton] =
  dialog?.querySelectorAll<Button>("mwc-button") ?? [];
const cancelCheckbox = dialog?.querySelector<Checkbox>("mwc-checkbox");
const closeMessage = dialog?.querySelector<HTMLElement>(
  "#cancelable-dialog-close-message",
);
const requestCloseMessage = dialog?.querySelector<HTMLElement>(
  "#cancelable-dialog-request-close-message",
);
const logs = document.querySelector<HTMLOListElement>(
  "#cancelable-dialog-logs",
);
const pre = logs?.parentElement;
const clearLogsButton = document.querySelector("#clear-cancelable-dialog-logs");

if (
  !showButton ||
  !requestCloseCheckbox ||
  !dialog ||
  !closeButton ||
  !closeWithValueButton ||
  !cancelCheckbox ||
  !closeMessage ||
  !requestCloseMessage ||
  !pre ||
  !logs ||
  !clearLogsButton
) {
  throw new Error("Missing stuffs");
}

const formatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});
const log = (message: string): void => {
  const li = document.createElement("li");
  li.textContent = `[${formatter.format(new Date())}] ${message}`;
  logs.append(li);
  pre.scrollTop = pre.scrollHeight;
};

showButton.addEventListener("click", () => {
  dialog.returnValue = "";
  dialog.showModal();
  closeMessage.hidden = requestCloseCheckbox.checked;
  requestCloseMessage.hidden = !requestCloseCheckbox.checked;
});

dialog.addEventListener("cancel", (event) => {
  if (!cancelCheckbox.checked) {
    return;
  }

  event.preventDefault();
  log("Dialog close canceled");
});
dialog.addEventListener("closed", () => {
  log(`Dialog closed. Return value: "${dialog.returnValue}"`);
});

closeButton.addEventListener("click", () => {
  if (requestCloseCheckbox.checked) {
    dialog.requestClose();
  } else {
    dialog.close();
  }
});
closeWithValueButton.addEventListener("click", () => {
  if (requestCloseCheckbox.checked) {
    dialog.requestClose("some value");
  } else {
    dialog.close("some value");
  }
});

clearLogsButton.addEventListener("click", () => {
  while (logs.lastChild) {
    logs.lastChild.remove();
  }
});
