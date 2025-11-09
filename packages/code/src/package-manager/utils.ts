import { DEFAULT_PACKAGE_MANAGERS } from "./constants.js";
import type { PackageManager } from "./types.js";

export function isPackageManager(value: string): value is PackageManager {
  return DEFAULT_PACKAGE_MANAGERS.includes(value as PackageManager);
}
