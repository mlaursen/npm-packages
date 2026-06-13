import { type IconProperties } from "../icon/types.js";

export interface SvgIconProperties extends IconProperties {
  /**
   * @defaultValue `"0 0 24 24"`
   */
  viewBox: string;
}
