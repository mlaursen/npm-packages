import { readFile } from "node:fs/promises";

import Shiki from "@shikijs/markdown-it";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import MarkdownIt from "markdown-it";

export async function loadShiki() {
  return await Shiki({
    themes: {
      light: "solarized-light",
      dark: "solarized-dark",
    },
    langs: [
      "js",
      "jsx",
      "ts",
      "tsx",
      "css",
      "scss",
      "html",
      "json",
      "sh",
      "md",
    ],

    defaultColor: "light-dark()",

    // supports other args
    parseMetaString: (meta) => {
      // eventually support this. these are the meta strings after the lang in a code block
      // i.e.
      // ```ts line-numbers
      //
      // ```

      const lineNumbers = /line-numbers/.test(meta);
      return { lineNumbers };
    },
    transformers: [
      transformerNotationDiff({ matchAlgorithm: "v3" }),
      transformerNotationHighlight({ matchAlgorithm: "v3" }),
      {
        name: "@mlaursen/shiki-highlight",
        enforce: "post",
        pre(element) {
          if (this.options.meta?.lineNumbers) {
            element.properties["data-line-numbers"] = "";
          }

          element.properties["dir"] = "ltr";
          delete element.properties.tabindex;
        },
      },
    ],
  });
}

/**
 * @param {import("#types").SiteData} _data
 * @param {Parameters<Parameters<import("11ty.ts").EleventyConfig["addPreprocessor"]>[2]>[1]} content
 */
export function shikiCssPreprocessor(_data, content) {
  if (!/|\s*(```|~~~)/m.test(content)) {
    return content;
  }

  return `${content}
{% css "global" %}
{% include "css/" + shikiCssFile %}
{% endcss %}
{% js "defer" %}
{% include "scripts/copy-to-clipboard.js" %}
{% endjs %}
`;
}

/**
 * @param {(markdownit: import("markdown-it").MarkdownIt) => void} shiki
 * @returns {import("esbuild").Plugin}
 */
export function shikiEsbuildPlugin(shiki) {
  const md = MarkdownIt();
  md.use(shiki);

  return {
    name: "shiki-esbuild-plugin",

    setup(build) {
      build.onLoad({ filter: /\.md$/ }, async (args) => {
        const source = await readFile(args.path, "utf8");
        const html = md.render(source);

        return {
          loader: "js",
          contents: `export default ${JSON.stringify(html)};`,
        };
      });
    },
  };
}
