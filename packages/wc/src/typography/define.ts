import { safeDefine } from "../utils/safeDefine.js";
import { Typography } from "./typography.js";

safeDefine("mwc-typography", Typography);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-typography": Typography;
  }
}
