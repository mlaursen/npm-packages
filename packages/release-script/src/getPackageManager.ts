import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type PackageManager = "npm" | "yarn" | "pnpm";
interface PartialPackageJson {
  volta?: Record<string, string>;
  packageManager?: string;
}

export async function getPackageManager(): Promise<PackageManager> {
  const rawPackageJson = await readFile(
    resolve(process.cwd(), "package.json"),
    "utf8"
  );
  const packageJson = JSON.parse(rawPackageJson) as PartialPackageJson;

  if (typeof packageJson.volta === "object" && packageJson.volta) {
    const { volta } = packageJson;
    if ("pnpm" in volta) {
      return "pnpm";
    }

    if ("yarn" in volta) {
      return "yarn";
    }

    return "npm";
  }

  if (typeof packageJson.packageManager === "string") {
    const mgr = packageJson.packageManager.replace(/@.+/, "");

    if (mgr === "pnpm" || mgr === "yarn" || mgr === "npm") {
      return mgr;
    }

    throw new Error(`Unsupported package manager "${mgr}" in package.json`);
  }

  throw new Error("Unable to find a package manager");
}
