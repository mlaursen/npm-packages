import { safeDefine } from "../utils/safeDefine.js";
import { Link } from "./link.js";

safeDefine("mwc-link", Link);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-link": Link;
  }
}
