import { safeDefine } from "../utils/safeDefine.js";
import { LinkCard } from "./link-card.js";
import "../box/define.js";
import "../elevation/define.js";

safeDefine(LinkCard);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-link-card": LinkCard;
  }
}
