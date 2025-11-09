import { createContext } from "react";

import type { PackageManagerContext } from "./types.js";

export const _PackageManagerContext =
  createContext<PackageManagerContext | null>(null);
_PackageManagerContext.displayName = "PackageManager";
