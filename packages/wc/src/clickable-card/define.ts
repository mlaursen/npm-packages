import { safeDefine } from "../utils/safeDefine.js";
import { ClickableCard } from "./clickable-card.js";
import "../box/define.js";
import "../elevation/define.js";

safeDefine("mwc-clickable-card", ClickableCard);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-clickable-card": ClickableCard;
  }
}
