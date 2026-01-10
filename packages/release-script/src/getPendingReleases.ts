import confirm from "@inquirer/confirm";
import input from "@inquirer/input";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { getUnpushedTags } from "./getUnpushedTags.js";

export interface GetPendingReleasesOptions {
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
  packagePaths?: Record<string, string>;
}

export interface PendingRelease {
  tagName: string;
  body: string;
}

export async function getPendingReleases(
  options: GetPendingReleasesOptions
): Promise<readonly PendingRelease[]> {
  const { packagePaths = {} } = options;
  const unpushedTags = getUnpushedTags();
  if (unpushedTags.length === 0) {
    throw new Error("Unable to find any pending releases");
  }

  const pending: PendingRelease[] = [];
  for (const unpushedTag of unpushedTags) {
    if (
      !(await confirm({ message: `Include ${unpushedTag} in the release?` }))
    ) {
      continue;
    }

    let path = packagePaths[name];
    if (!path) {
      path = await input({
        message: `${name} CHANGELOG exists at:`,
        default: ".",
      });
    }

    const changelog = await readFile(
      resolve(process.cwd(), path, "CHANGELOG.md"),
      "utf8"
    );

    let body = "";
    let isTracking = false;
    const lines = changelog.split(/\r?\n/);
    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (isTracking) {
          break;
        }

        isTracking = true;
        body = line;
      } else if (isTracking) {
        body += `\n${line}`;
      }
    }

    pending.push({
      body,
      tagName: unpushedTag,
    });
  }

  if (pending.length === 0) {
    throw new Error("No pending releases were confirmed");
  }

  return pending;
}
