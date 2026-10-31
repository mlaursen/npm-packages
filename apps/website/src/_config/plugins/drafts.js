/**
 * @param {import("#types").SiteData} data
 */
function permalink(data) {
  // Always skip during non-watch/serve builds
  if (data.draft && !process.env.BUILD_DRAFTS) {
    return false; // Ensure templates that use this handle it correctly
  }

  return data.permalink;
}

/**
 * @param {import("#types").SiteData} data
 */
function eleventyExcludeFromCollections(data) {
  // Always exclude from non-watch/serve builds
  if (data.draft && !process.env.BUILD_DRAFTS) {
    return true;
  }

  return data.eleventyExcludeFromCollections ?? false;
}

/**
 * @param {import("11ty.ts").EleventyConfig} eleventyConfig
 */
export function draftsPlugin(eleventyConfig) {
  eleventyConfig.addGlobalData("eleventyComputed.permalink", () => permalink);

  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
  eleventyConfig.addGlobalData(
    "eleventyComputed.eleventyExcludeFromCollections",
    () => eleventyExcludeFromCollections,
  );

  eleventyConfig.on("eleventy.before", ({ runMode }) => {
    // Set the environment variable
    if (runMode === "serve" || runMode === "watch") {
      process.env.BUILD_DRAFTS = true;
    }
  });
}
