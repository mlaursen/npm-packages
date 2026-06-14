import { EleventyRenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import litPlugin from "@lit-labs/eleventy-plugin-lit";
import { enableLogger, log } from "@mlaursen/node-utils";
import dotenv from "dotenv";

import { ENABLE_SSR, ROOT_DIR } from "./src/_config/constants.js";
import { buildJs } from "./src/_config/events/build-js.js";
import { buildScss } from "./src/_config/events/build-scss.js";
import { slugify } from "./src/_config/filters/slugify.js";
import { draftsPlugin } from "./src/_config/plugins/drafts.js";
import { htmlPlugin } from "./src/_config/plugins/html.js";

dotenv.config({ quiet: true, override: true });

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function createConfig(eleventyConfig) {
  enableLogger();
  eleventyConfig.on("eleventy.before", async () => {
    await buildScss();
    await buildJs();
  });

  eleventyConfig.addWatchTarget(
    `./${ROOT_DIR}/assets/**/*.{scss,js,ts,svg,png,jpeg}`,
  );

  eleventyConfig.addLayoutAlias("base", "base.njk");
  eleventyConfig.addLayoutAlias("base-nav", "base-nav.njk");
  eleventyConfig.addLayoutAlias("page", "page.njk");
  eleventyConfig.addLayoutAlias("docs", "docs.njk");

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
  if (ENABLE_SSR) {
    log("Enabling SSR for web components");
    eleventyConfig.addPlugin(litPlugin, {
      mode: "worker",
      componentModules: [`${ROOT_DIR}/assets/scripts/main.js`],
    });
  }

  eleventyConfig.addBundle("css", { hoist: true });

  eleventyConfig.addFilter("slugify", slugify);

  eleventyConfig.addPassthroughCopy(`${ROOT_DIR}/assets/fonts`);
  eleventyConfig.addPassthroughCopy({
    [`${ROOT_DIR}/assets/favicon/*`]: "/",
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
      input: ROOT_DIR,
      includes: "_includes",
      layouts: "_layouts",
    },
  };
}
