import type { Box, Card } from "@mlaursen/wc";

const dndArea = document.querySelector<Box>("#dnd-area");
if (!dndArea) {
  throw new Error("Missing DND Area");
}

let draggedCard: Card | null = null;
dndArea.addEventListener("dragstart", (event) => {
  draggedCard = event.target as Card;

  if (event.dataTransfer) {
    draggedCard.setAttribute("dragging", "");
    const preview = draggedCard.cloneNode(true) as Card;
    preview.style.position = "absolute";
    preview.style.top = "-9999px";
    preview.style.width = `${draggedCard.offsetWidth}`;
    document.body.append(preview);
    event.dataTransfer.setDragImage(preview, event.offsetX, event.offsetY);
    setTimeout(() => preview.remove(), 0);
  }
});
dndArea.addEventListener("dragend", () => {
  if (!draggedCard) {
    return;
  }

  draggedCard.removeAttribute("dragging");
  draggedCard = null;
});

dndArea.addEventListener("dragover", (event) => {
  if (!draggedCard || !(event.target instanceof Element)) {
    return;
  }

  event.preventDefault();

  const target = event.target.closest("mwc-clickable-card");
  if (!target || target === draggedCard) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  const isAfter = offsetX > rect.width / 2 || offsetY > rect.height / 2;

  dndArea.insertBefore(draggedCard, isAfter ? target.nextSibling : target);
});
