import { type SpawnSyncOptions, spawnSync } from "node:child_process";

import { continueRelease } from "./continueRelease.js";
import {
  type ConfigurableCreateReleaseOptions,
  createRelease,
} from "./createRelease.js";
import { getPackageManager } from "./getPackageManager.js";
import {
  type GetPendingReleasesOptions,
  getPendingReleases,
} from "./getPendingReleases.js";

const exec = (
  command: string,
  args: readonly string[],
  opts?: SpawnSyncOptions,
): void => {
  const cmd = command + " " + args.join(" ");
  console.log(cmd);
  const result = spawnSync(command, args, opts);
  if (result.status !== 0) {
    throw new Error(`${cmd} failed with exit code: ${result.status ?? 1}`);
  }
};

export interface ReleaseOptions
  extends ConfigurableCreateReleaseOptions, GetPendingReleasesOptions {
  /**
   * @defaultValue `!buildCommand`
   */
  skipBuild?: boolean;

  /**
   * @defaultValue `"clean"`
   */
  cleanCommand?: string;

  /**
   * @defaultValue `"build"`
   */
  buildCommand?: string;

  /**
   * @defaultValue `"build(version): version package"`
   */
  versionMessage?: string;

  /**
   * @defaultValue `publishTags.length > 0`
   */
  githubReleaseOnly?: boolean;

  /**
   * This was added so that the lockfile can be updated or any other scripts
   * can be run after:
   *
   * ```sh
   * changeset version
   * ```
   *
   * This must be a string without spaces. Any additional args should be passed
   * through {@link postVersionCommandArgs}
   */
  postVersionCommand?: string;

  /**
   * Any additional args to pass to {@link postVersionCommand}
   */
  postVersionCommandArgs?: readonly string[];

  /**
   * Any spawn sync options for the post version command. The idea is something
   * like:
   *
   * ```ts
   * await release({
   *   repo: "whatever",
   *   postVersionCommand: "pnpm install && pnpm dedupe",
   *   postVersionCommandOpts: {
   *     shell: true,
   *     stdio: "inherit",
   *   },
   * });
   * ```
   */
  postVersionCommandOpts?: SpawnSyncOptions;
}

export async function release(options: ReleaseOptions): Promise<void> {
  const {
    owner = "mlaursen",
    repo,
    envPath = ".env.local",
    cleanCommand = "clean",
    buildCommand = "build",
    skipBuild = !buildCommand,
    versionMessage = "build(version): version package",
    githubReleaseOnly = (options.publishTags ?? []).length > 0,
    postVersionCommand = "",
    postVersionCommandArgs = [],
    postVersionCommandOpts,
  } = options;

  if (
    typeof postVersionCommand !== "string" ||
    postVersionCommand.includes(" ")
  ) {
    throw new TypeError("postVersionCommand must be a string without spaces");
  }

  if (postVersionCommandArgs.some((arg) => typeof arg !== "string")) {
    throw new TypeError("postVersionCommandArgs must be an array of strings");
  }

  if (!githubReleaseOnly) {
    const pkgManager = await getPackageManager();

    if (!skipBuild) {
      exec(pkgManager, [cleanCommand]);
      exec(pkgManager, [buildCommand]);
    }
    await continueRelease();

    exec(pkgManager, ["changeset", "version"], { stdio: "inherit" });
    if (postVersionCommand) {
      exec(postVersionCommand, postVersionCommandArgs, postVersionCommandOpts);
    }

    exec("git", ["add", "-u"]);
    await continueRelease();

    exec("git", ["commit", "-m", versionMessage]);
    exec(pkgManager, ["changeset", "publish"], { stdio: "inherit" });
  }

  const pendingReleases = await getPendingReleases(options);
  exec("git", ["push", "--follow-tags"]);

  for (const release of pendingReleases) {
    await createRelease({
      owner,
      repo,
      body: release.body,
      tagName: release.tagName,
      envPath,
      prerelease: /-(alpha|next|beta)\.\d+$/.test(release.tagName),
    });
  }
}
