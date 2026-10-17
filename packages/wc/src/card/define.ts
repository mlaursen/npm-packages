import { safeDefine } from "../utils/safeDefine.js";
import "../box/define.js";
import "../elevation/define.js";
import { Card } from "./card.js";

safeDefine(Card);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-card": Card;
  }
}
