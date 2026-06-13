export type SheetHeaderAutoFocus = "back" | "close" | "auto";

export interface SheetHeaderProperties {
  /**
   * @defaultValue `"auto"`
   */
  autoFocus: SheetHeaderAutoFocus;

  /**
   * @defaultValue `"Back"`
   */
  backLabel: string;

  /**
   * @defaultValue `false`
   */
  backButton: boolean;

  /**
   * @defaultValue `"Close"`
   */
  closeLabel: string;

  /**
   * @defaultValue `false`
   */
  closeButton: boolean;
}
