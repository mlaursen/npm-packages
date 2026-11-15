import "../button/define.js";
import "../icon-button/define.js";
import "../material-symbol/define.js";
import { safeDefine } from "../utils/safeDefine.js";
import { Toast } from "./toast.js";

safeDefine(Toast);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-toast": Toast;
  }
}
