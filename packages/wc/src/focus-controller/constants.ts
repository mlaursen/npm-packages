// oxlint-disable-next-line no-redeclare
export const FocusKey = {
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
} as const;
export type FocusKey = keyof typeof FocusKey;
