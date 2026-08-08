// @ts-check
import "./src/_config/env.js";

import { defineConfig } from "11ty.ts";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import litPlugin from "@lit-labs/eleventy-plugin-lit";
import { enableLogger, log } from "@mlaursen/node-utils";

import {
  ASSETS_DIR,
  ENABLE_SSR,
  ROOT_DIR,
  WC_ROOT,
} from "./src/_config/constants.js";
import { buildJs } from "./src/_config/events/build-js.js";
import { buildScss } from "./src/_config/events/build-scss.js";
import { slugify } from "./src/_config/filters/slugify.js";
import { draftsPlugin } from "./src/_config/plugins/drafts.js";
import { htmlPlugin } from "./src/_config/plugins/html.js";

export default defineConfig((eleventyConfig) => {
  enableLogger();
  eleventyConfig.on("eleventy.before", async () => {
    await buildScss();
    await buildJs();
  });

  eleventyConfig.addWatchTarget(
    `./${ASSETS_DIR}/**/*.{scss,js,ts,svg,png,jpeg}`,
  );

  eleventyConfig.addLayoutAlias("base", "base.njk");
  eleventyConfig.addLayoutAlias("base-nav", "base-nav.njk");
  eleventyConfig.addLayoutAlias("page", "page.njk");
  eleventyConfig.addLayoutAlias("docs", "docs.njk");

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(htmlPlugin);
  eleventyConfig.addPlugin(draftsPlugin);

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: ["auto"],
    htmlOptions: {
      imgAttributes: {
        alt: "",
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
      componentModules: [`${WC_ROOT}/dist/index.js`],
    });
  }

  eleventyConfig.addBundle("js", { hoist: true });
  eleventyConfig.addBundle("css", { hoist: true });

  eleventyConfig.addFilter("slugify", slugify);

  eleventyConfig.addPassthroughCopy(`${ASSETS_DIR}/fonts`);
  eleventyConfig.addPassthroughCopy({
    [`${ASSETS_DIR}/favicon/*`]: "/",
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
});
