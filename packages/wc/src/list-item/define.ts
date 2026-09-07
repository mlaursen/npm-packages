import { safeDefine } from "../utils/safeDefine.js";
import { ListItem } from "./list-item.js";

safeDefine("mwc-list-item", ListItem);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-list-item": ListItem;
  }
}
