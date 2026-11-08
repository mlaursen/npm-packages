import type { Box, Button, CopyToClipboard } from "@mlaursen/wc";

const content = document.querySelector<HTMLParagraphElement>("#content");
const asyncEvent = document.querySelector<CopyToClipboard>("#async-event");
const copyImage = document.querySelector<CopyToClipboard>("#copy-image");
const pasteOutput = document.querySelector<Box>(".paste-output");
const clearPaste = document.querySelector<Button>("#clear-paste");
if (!content || !asyncEvent || !copyImage || !pasteOutput || !clearPaste) {
  throw new Error("Missing stuff");
}

asyncEvent.addEventListener("clipboard-copy-data", (event) => {
  event.waitUntil(Promise.resolve(content.textContent));
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="tomato"/>
</svg>`;
const load = async (): Promise<ClipboardItem> => {
  const img = new Image();
  img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  await img.decode();

  const canvas = new OffscreenCanvas(24, 24);
  canvas.getContext("2d")?.drawImage(img, 0, 0);
  const png = await canvas.convertToBlob({ type: "image/png" });

  return new ClipboardItem({ "image/png": png });
};

copyImage.addEventListener("clipboard-copy-data", (event) => {
  event.waitUntil(load());
});

document.addEventListener("paste", (event) => {
  const file = [...(event.clipboardData?.files ?? [])][0];
  if (file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    pasteOutput.append(img);
  } else {
    const data = event.clipboardData?.getData("text");
    const typography = document.createElement("mwc-typography");
    typography.setAttribute("margin", "none");
    const p = document.createElement("p");
    p.append(document.createTextNode(data ?? ""));
    typography.append(p);
    pasteOutput.append(typography);
  }
  pasteOutput.scrollTop = pasteOutput.offsetHeight;
});

clearPaste.addEventListener("click", () => {
  pasteOutput.replaceChildren();
});
