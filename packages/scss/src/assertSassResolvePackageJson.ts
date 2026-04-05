export interface SassResolvePackageJson {
  sass?: string;
  main?: string;

  exports?: {
    [relativePath: string]: string | null | { sass?: string | null };
  };
}

export function assertSassResolvePackageJson(
  packageJson: unknown
): asserts packageJson is SassResolvePackageJson {
  if (
    typeof packageJson !== "object" ||
    !packageJson ||
    ((!("sass" in packageJson) || typeof packageJson.sass !== "string") &&
      (!("main" in packageJson) || typeof packageJson.main !== "string") &&
      (!("exports" in packageJson) ||
        typeof packageJson.exports !== "object" ||
        !packageJson.exports))
  ) {
    throw new Error("Invalid package.json");
  }
}
