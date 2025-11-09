import { useContext } from "react";

import { _PackageManagerContext } from "./PackageManagerContext.js";
import type { PackageManagerContext } from "./types.js";

export function usePackageManager(): PackageManagerContext {
  const value = useContext(_PackageManagerContext);
  if (!value) {
    throw new Error("PackageManagerProvider is not mounted");
  }

  return value;
}
