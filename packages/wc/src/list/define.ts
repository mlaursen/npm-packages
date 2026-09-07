import { safeDefine } from "../utils/safeDefine.js";
import { List } from "./list.js";

safeDefine("mwc-list", List);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-list": List;
  }
}
