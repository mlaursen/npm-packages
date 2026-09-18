import { safeDefine } from "../utils/safeDefine.js";
import { Avatar } from "./avatar.js";

safeDefine("mwc-avatar", Avatar);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-avatar": Avatar;
  }
}
