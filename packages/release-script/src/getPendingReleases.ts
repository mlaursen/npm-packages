import confirm from "@inquirer/confirm";

import { type GetChangelogOptions, getChangelog } from "./getChangelog.js";
import { getUnpushedTags } from "./getUnpushedTags.js";

export interface GetPendingReleasesOptions extends Pick<
  GetChangelogOptions,
  "packagePaths"
> {
  /**
   * This is an array of tags to use to create a github releases. This was
   * added to support cases where this stage failed due to an error being
   * thrown or an invalid GITHUB token, or anything else.
   *
   * @example
   * ```ts
   * release({
   *   publishTags: ["@mlaursen/release-script@1.0.0"]
   * })
   * ```
   */
  publishTags?: readonly string[];

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
  options: GetPendingReleasesOptions,
): Promise<readonly PendingRelease[]> {
  const {
    packagePaths,
    publishTags,
    disableGithubReleasePackages = new Set<string>(),
  } = options;
  let releaseTags = publishTags ?? [];
  if (!publishTags) {
    releaseTags = getUnpushedTags();
    if (releaseTags.length === 0) {
      throw new Error("Unable to find any pending releases");
    }
  }

  const pending: PendingRelease[] = [];
  for (const unpushedTag of releaseTags) {
    let name = unpushedTag.trim();

    // remove the version number and just keep the scope. i.e.
    // @mlaursen/release-script@1.1.1 -> @mlaursen/release-script
    // package-name@1.0.0             -> package-name
    const atIndex = name.indexOf("@", 1);
    if (atIndex > 0) {
      name = name.slice(0, atIndex);
    }

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
