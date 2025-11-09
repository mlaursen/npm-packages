export type PackageManager = "npm" | "yarn" | "pnpm" | (string & {});

export interface PackageManagerContext {
  packageManager: PackageManager;
  packageManagers: readonly PackageManager[];
  setPackageManager: (packageManager: PackageManager) => void;
}
