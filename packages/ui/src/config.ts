let _rtl = true;
let _varPrefix = "--ui-";

export interface UiConfig {
  /**
   * @defaultValue `true`
   */
  rtl: boolean;

  /**
   * @defaultValue `"--ui-"`
   */
  varPrefix: string;
}

export const UI_CONFIG: UiConfig = {
  get rtl(): boolean {
    return _rtl;
  },
  set rtl(rtl: boolean) {
    _rtl = rtl;
  },

  get varPrefix(): string {
    return _varPrefix;
  },
  set varPrefix(varPrefix: string) {
    _varPrefix = varPrefix;
  },
};
