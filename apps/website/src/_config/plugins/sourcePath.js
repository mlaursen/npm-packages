// @ts-check

import { join } from "node:path";

/**
 * @param {import("#types").ComputedData<"wc">} data
 * @param {boolean} [file=false]
 * @returns {string}
 */
function getSourcePath(data, file = false) {
  const { meta, git } = data;

  /** @type {string} */
  let repoName = data.repoName ?? "";
  /** @type {string} */
  let packagePath = data.packagePath ?? "";

  if (file) {
    repoName ||= "npm-packages";
    packagePath ||= ".";
  }

  const sourceBase = meta.sourceBase;
  if (!packagePath || !repoName) {
    return sourceBase;
  }

  const repoPath = `${sourceBase}/${repoName || "npm-packages"}`;
  if (!packagePath) {
    return repoPath;
  }

  return `${repoPath}/${file ? "blob" : "tree"}/${git.commit}/${packagePath}`;
}

/**
 * @param {import("11ty.ts").EleventyConfig} eleventyConfig
 */
export function sourcePathPlugin(eleventyConfig) {
  eleventyConfig.addGlobalData("eleventyComputed", {
    /** @type {import("#types").EleventyComputedCallback<"sourcePath", "wc">} */
    sourcePath: (data) => getSourcePath(data, false),

    /** @type {import("#types").EleventyComputedCallback<"editPagePath", "wc">} */
    editPagePath: (data) => {
      const base = getSourcePath(data, true);
      return join(base, data.page.inputPath);
    },
  });
}
