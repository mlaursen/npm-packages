import { safeDefine } from "../utils/safeDefine.js";
import { Avatar } from "./avatar.js";

safeDefine(Avatar);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-avatar": Avatar;
  }
}
