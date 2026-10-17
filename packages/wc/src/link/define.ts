import { safeDefine } from "../utils/safeDefine.js";
import { Link } from "./link.js";

safeDefine(Link);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-link": Link;
  }
}
