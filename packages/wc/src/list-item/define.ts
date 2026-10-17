import { safeDefine } from "../utils/safeDefine.js";
import { ListItem } from "./list-item.js";

safeDefine(ListItem);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-list-item": ListItem;
  }
}
