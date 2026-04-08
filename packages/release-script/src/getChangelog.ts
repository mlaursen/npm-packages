import input from "@inquirer/input";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function readChangelogFile(path: string): Promise<string> {
  const filePath = resolve(process.cwd(), path, "CHANGELOG.md");

  try {
    return await readFile(filePath, "utf8");
  } catch {
    const nextPath = await input({
      message: `${path} did not have a CHANGELOG.md. Enter a new path or an empty string to ignore this package.`,
      default: "",
    });

    if (nextPath) {
      return await readChangelogFile(nextPath);
    }

    return "";
  }
}

export interface GetChangelogOptions {
  name: string;

  /**
   * This should be a record of package names to paths for monorepos.
   *
   * @example Monorepo Setup
   * ```tsx
   * packagePaths: {
   *   "@react-md/core": "./packages/core",
   *   "docs": "./apps/docs"
   * },
   * ```
   *
   * If this is omitted or not matched, it will default to `"."`
   *
   * @defaultValue `{}`
   */
  packagePaths?: Record<string, string> | undefined;
}

export async function getChangelog(
  options: GetChangelogOptions
): Promise<string> {
  const { name, packagePaths = {} } = options;

  let path = packagePaths[name];
  if (!path) {
    path = await input({
      message: `${name} CHANGELOG exists at:`,
      default: ".",
    });
  }

  return await readChangelogFile(path);
}
