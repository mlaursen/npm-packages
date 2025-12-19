import { type ExecSyncOptions, execSync } from "node:child_process";

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

const exec = (command: string, opts?: ExecSyncOptions): void => {
  console.log(command);
  execSync(command, opts);
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
}

export async function release(options: ReleaseOptions): Promise<void> {
  const {
    owner,
    repo,
    envPath,
    cleanCommand = "clean",
    buildCommand = "build",
    skipBuild = !buildCommand,
    versionMessage = "build(version): version package",
  } = options;

  const pkgManager = await getPackageManager();

  if (!skipBuild) {
    exec(`${pkgManager} ${cleanCommand}`);
    exec(`${pkgManager} ${buildCommand}`);
  }
  await continueRelease();

  exec("pnpm changeset version", { stdio: "inherit" });
  exec("git add -u");
  await continueRelease();

  exec(`git commit -m "${versionMessage}"`);
  exec(`${pkgManager} changeset publish`, { stdio: "inherit" });
  const pendingReleases = await getPendingReleases(options);

  exec("git push --follow-tags");

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
