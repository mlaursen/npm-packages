import Shiki from "@shikijs/markdown-it";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";

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

/** @type {Parameters<import ("11ty.ts").EleventyConfig["addPreprocessor"]>[2]} */
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
