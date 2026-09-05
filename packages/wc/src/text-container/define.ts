import { safeDefine } from "../utils/safeDefine.js";
import { TextContainer } from "./text-container.js";

safeDefine("mwc-text-container", TextContainer);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-text-container": TextContainer;
  }
}
