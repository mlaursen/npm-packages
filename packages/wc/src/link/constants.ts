import type { PassThroughLinkProperties } from "./types.js";

export const PASS_THROUGH_PROPS = [
  "rel",
  "href",
  "hreflang",
  "target",
  "download",
  "ping",
  "type",
  "referrerPolicy",
] satisfies readonly (keyof PassThroughLinkProperties)[];
