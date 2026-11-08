import { safeDefine } from "../utils/safeDefine.js";
import { CopyToClipboard } from "./copy-to-clipboard.js";

safeDefine(CopyToClipboard);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-copy-to-clipboard": CopyToClipboard;
  }
}
