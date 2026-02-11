import confirm from "@inquirer/confirm";
import { Octokit } from "@octokit/core";
import dotenv from "dotenv";

export interface ConfigurableCreateReleaseOptions {
  repo: string;

  /**
   * @defaultValue `"mlaursen"`
   */
  owner?: string;

  /**
   * The `.env` file to load to get the {@link tokenName} environment variable.
   *
   * @defaultValue `".env.local"`
   */
  envPath?: string;

  /**
   * @defaultValue `"GITHUB_RELEASE_TOKEN"`
   */
  tokenName?: string;
}

export interface CreateReleaseOptions extends ConfigurableCreateReleaseOptions {
  body: string;
  override?: boolean;
  tagName: string;
  prerelease: boolean;
}

export async function createRelease(
  options: CreateReleaseOptions
): Promise<void> {
  const {
    body,
    override,
    owner = "mlaursen",
    repo,
    prerelease,
    envPath = ".env.local",
    tagName,
    tokenName = "GITHUB_RELEASE_TOKEN",
  } = options;

  dotenv.config({ path: envPath, override, quiet: true });
  const octokit = new Octokit({ auth: process.env[tokenName] });
  try {
    const response = await octokit.request(
      "POST /repos/{owner}/{repo}/releases",
      {
        owner,
        repo,
        tag_name: tagName,
        body,
        prerelease,
      }
    );

    console.log(`Created release: ${response.data.html_url}`);
  } catch (error) {
    console.error(error);

    console.log();
    console.log(
      "The npm token is most likely expired or never created. Update the `.env.local` to include the latest GITHUB_TOKEN"
    );
    console.log(
      "Regenerate the token: https://github.com/settings/personal-access-tokens"
    );
    if (
      !(await confirm({ message: "Try creating the Github release again?" }))
    ) {
      throw new Error("Unable to create a Github release", { cause: error });
    }

    return createRelease({ ...options, override: true });
  }
}
