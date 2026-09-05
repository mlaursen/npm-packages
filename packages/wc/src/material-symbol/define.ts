import { safeDefine } from "../utils/safeDefine.js";
import { MaterialSymbol } from "./material-symbol.js";

safeDefine("mwc-material-symbol", MaterialSymbol);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-material-symbol": MaterialSymbol;
  }
}
