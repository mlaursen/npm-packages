import type { InteractionDirection } from "../interaction/types.js";

export type PassThroughLinkProperties = Partial<
  Pick<
    HTMLAnchorElement,
    | "rel"
    | "href"
    | "hreflang"
    | "target"
    | "download"
    | "referrerPolicy"
    | "ping"
    | "type"
  >
>;

export interface LinkProperties extends PassThroughLinkProperties {
  "aria-current"?: "page";
  href: string;
  interaction: InteractionDirection;
  inline?: boolean;
}
