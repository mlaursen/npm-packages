import { safeDefine } from "../utils/safeDefine.js";
import { DialogActions } from "./dialog-actions.js";

safeDefine(DialogActions);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-actions": DialogActions;
  }
}
