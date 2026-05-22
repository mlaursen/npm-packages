import { EleventyRenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import webc from "@11ty/eleventy-plugin-webc";
import litPlugin from "@lit-labs/eleventy-plugin-lit";
import dotenv from "dotenv";

import { buildJs } from "./src/_config/events/build-js.js";
import { buildScss } from "./src/_config/events/build-scss.js";
import { slugify } from "./src/_config/filters/slugify.js";
import { sortAlphaNumeric } from "./src/_config/filters/sortAlphaNumeric.js";
import { draftsPlugin } from "./src/_config/plugins/drafts.js";
import { htmlPlugin } from "./src/_config/plugins/html.js";

const rootDir = "src";
const SSR = process.argv.includes("--ssr");
const DEV = process.argv.includes("--dev");

dotenv.config({
  quiet: true,
  path: `.env.${DEV ? "development" : "production"}`,
});
dotenv.config({ quiet: true });

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function createConfig(eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    await buildScss(rootDir);
    await buildJs(rootDir);
  });

  eleventyConfig.addWatchTarget(
    `./${rootDir}/assets/**/*.{scss,js,svg,png,jpeg}`,
  );
  eleventyConfig.addWatchTarget(`./${rootDir}/_includes/**/*.{webc}`);

  eleventyConfig.addLayoutAlias("base", "base.njk");
  eleventyConfig.addLayoutAlias("page", "page.njk");
  eleventyConfig.addLayoutAlias("docs", "docs.njk");

  eleventyConfig.addPlugin(webc, {
    components: [`./${rootDir}/_includes/webc/**/*.webc`],
    useTransform: true,
  });

  eleventyConfig.addPlugin(htmlPlugin);
  eleventyConfig.addPlugin(draftsPlugin);

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: ["auto"],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });
  if (SSR) {
    eleventyConfig.addPlugin(litPlugin, {
      mode: "worker",
      componentModules: [`${rootDir}/assets/scripts/main.js`],
    });
  }

  eleventyConfig.addBundle("css", { hoist: true });

  eleventyConfig.addFilter("slugify", slugify);
  eleventyConfig.addFilter("alphanumeric", sortAlphaNumeric);

  eleventyConfig.addPassthroughCopy(`${rootDir}/assets/fonts`);
  eleventyConfig.addPassthroughCopy({
    [`${rootDir}/assets/favicon/*`]: "/",
  });

  // force reload instead of hot reload since lit shadow dom styles are lost
  // with hot reloads
  eleventyConfig.setServerOptions({
    domDiff: false,
  });

  return {
    markdownTemplateEngine: "njk",

    dir: {
      output: "_site",
      input: rootDir,
      includes: "_includes",
      layouts: "_layouts",
    },
  };
}
