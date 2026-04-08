import confirm from "@inquirer/confirm";

import { type GetChangelogOptions, getChangelog } from "./getChangelog.js";
import { getUnpushedTags } from "./getUnpushedTags.js";

export interface GetPendingReleasesOptions extends Pick<
  GetChangelogOptions,
  "packagePaths"
> {
  /**
   * A set of packages that should never attempt to create a github release.
   *
   * @defaultValue `new Set()`
   */
  disableGithubReleasePackages?: ReadonlySet<string>;
}

export interface PendingRelease {
  tagName: string;
  body: string;
}

export async function getPendingReleases(
  options: GetPendingReleasesOptions
): Promise<readonly PendingRelease[]> {
  const { packagePaths, disableGithubReleasePackages = new Set<string>() } =
    options;
  const unpushedTags = getUnpushedTags();
  if (unpushedTags.length === 0) {
    throw new Error("Unable to find any pending releases");
  }

  const pending: PendingRelease[] = [];
  for (const unpushedTag of unpushedTags) {
    const name = unpushedTag.replace(/@\d+.+$/, "");
    if (
      disableGithubReleasePackages.has(name) ||
      !(await confirm({ message: `Include ${unpushedTag} in the release?` }))
    ) {
      continue;
    }

    const changelog = await getChangelog({
      name,
      packagePaths,
    });

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
