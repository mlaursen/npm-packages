import { safeDefine } from "../utils/safeDefine.js";
import "../typography/define.js";
import { AppBarTitle } from "./app-bar-title.js";

safeDefine(AppBarTitle);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-app-bar-title": AppBarTitle;
  }
}
