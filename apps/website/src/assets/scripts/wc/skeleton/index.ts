import type { Skeleton } from "@mlaursen/wc";

const skeleton = document.querySelector<Skeleton>("#target");

if (!skeleton) {
  throw new Error("Missing stuff");
}

setInterval(() => {
  skeleton.active = !skeleton.active;
}, 2000);
