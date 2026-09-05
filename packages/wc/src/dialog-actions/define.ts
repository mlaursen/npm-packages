import { safeDefine } from "../utils/safeDefine.js";
import { DialogActions } from "./dialog-actions.js";

safeDefine("mwc-dialog-actions", DialogActions);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-actions": DialogActions;
  }
}
