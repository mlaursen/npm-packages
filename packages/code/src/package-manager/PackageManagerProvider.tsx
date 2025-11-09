"use client";

import { type UseStateInitializer } from "@react-md/core/types";
import { type ReactElement, type ReactNode, useMemo, useState } from "react";

import { _PackageManagerContext } from "./PackageManagerContext.js";
import { DEFAULT_PACKAGE_MANAGERS } from "./constants.js";
import type { PackageManager, PackageManagerContext } from "./types.js";

const noop = (): void => {
  // do nothing
};

export interface PackageManagerProviderProps {
  children: ReactNode;

  /** @defaultValue `"npm"` */
  defaultValue?: UseStateInitializer<PackageManager>;

  /** @defaultValue `DEFAULT_PACKAGE_MANAGERS` */
  packageManagers?: readonly PackageManager[];
  onPackageManagerChange?: (nextPackageManager: PackageManager) => void;
}

export function PackageManagerProvider(
  props: PackageManagerProviderProps
): ReactElement {
  const {
    children,
    defaultValue = "npm",
    packageManagers = DEFAULT_PACKAGE_MANAGERS,
    onPackageManagerChange = noop,
  } = props;

  const [packageManager, setPackageManager] = useState(defaultValue);
  const value = useMemo<PackageManagerContext>(
    () => ({
      packageManager,
      packageManagers,
      setPackageManager(nextPackageManager) {
        onPackageManagerChange(nextPackageManager);
        setPackageManager(nextPackageManager);
      },
    }),
    [onPackageManagerChange, packageManager, packageManagers]
  );

  return (
    <_PackageManagerContext.Provider value={value}>
      {children}
    </_PackageManagerContext.Provider>
  );
}
