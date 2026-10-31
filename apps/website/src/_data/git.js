import { execSync } from "node:child_process";

import { IS_PRODUCTION } from "../_config/constants.js";

/**
 * @param {string} cmd
 * @returns {string}
 */
const run = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

export default function git() {
  const sha = process.env.GITHUB_SHA || run("git rev-parse HEAD");
  const branch =
    process.env.GITHUB_HEAD_REF ||
    process.env.GITHUB_REF_NAME ||
    run("git rev-parse --abbrev-ref HEAD");

  return {
    sha,
    short: sha.slice(0, 7),
    branch,
    commit: IS_PRODUCTION ? sha : branch,
  };
}
