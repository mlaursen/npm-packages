import { safeDefine } from "../utils/safeDefine.js";
import "../app-bar-title/define.js";
import "../elevation/define.js";
import { AppBar } from "./app-bar.js";

safeDefine(AppBar);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-app-bar": AppBar;
  }
}
