// https://github.com/markdown-it/markdown-it/blob/a8c00d47/src/renderer.ts#L6
//
// Rules markdown-it defines by default (the only ones with custom implementations)
//
// code_inline, code_block, fence
// image
// hardbreak, softbreak
// text
// html_block, html_inline
//
// Token types you can override (using the default CommonMark and GFM-table preset that Eleventy uses)
//
// Block-level, each with _open and _close unless noted:
//
// paragraph, heading, blockquote
// bullet_list, ordered_list, list_item
// table, thead, tbody, tr, th, td
// hr (single token, no open/close)
//
// Inline-level:
//
// em, strong, s (strikethrough, with _open and _close)
// link (link_open and link_close)
/** @type {Record<string, string[]> & { h6: string[]}} */
const HEADINGS = {
  h1: ["small", "display"],
  h2: ["large", "headline"],
  h3: ["medium", "headline"],
  h4: ["small", "headline"],
  h5: ["large", "title"],
  h6: ["medium", "title"],
};

/**
 * this is just used to get highlighting and formatting for html
 *
 * @param {TemplateStringsArray} strings
 * @param {string[]} values
 * @returns {string}
 */
const html = (strings, ...values) =>
  strings.reduce((out, str, i) => out + str + (values[i] ?? ""), "");

/** @param {import("markdown-it").MarkdownIt} md */
export function markdownRenderers(md) {
  md.renderer.rules.paragraph_open = () => "<mwc-typography><p>";
  md.renderer.rules.paragraph_close = () => "</p></mwc-typography>";
  md.renderer.rules.heading_open = (tokens, idx) => {
    const token = tokens[idx];
    if (!token) {
      return "";
    }

    const id = token.attrGet("id");
    const [size, variant] = HEADINGS[token.tag] ?? HEADINGS.h6;

    const attrs = [
      id && `id="${id}"`,
      `size="${size}"`,
      `variant="${variant}"`,
    ].filter(Boolean);
    return `<mwc-typography ${attrs.join("")}><${token.tag}>`;
  };
  md.renderer.rules.heading_close = (tokens, idx) => {
    const token = tokens[idx];
    if (!token) {
      return "";
    }

    return `</${token.tag}></mwc-typography>`;
  };

  // md.renderer.rules.blockquote_open = (tokens, idx, options, env, renderer) => {};
  // md.renderer.rules.blockquote_close = (tokens, idx, options, env, renderer) => {};

  md.renderer.rules.link_open = (tokens, idx, _options, _env, renderer) => {
    const token = tokens[idx];
    if (!token) {
      return "";
    }

    return `<mwc-link${renderer.renderAttrs(token)}>`;
  };
  md.renderer.rules.link_close = () => "</mwc-link>";

  md.renderer.rules.hr = () => "<mwc-divider></mwc-divider>";

  // md.renderer.rules.table_open
  // md.renderer.rules.thead_open
  // md.renderer.rules.tbody_open
  // md.renderer.rules.tr_open
  // md.renderer.rules.th_open
  // md.renderer.rules.td_open

  // md.renderer.rules.bullet_list_open
  // md.renderer.rules.ordered_list_open
  // md.renderer.rules.list_item_open

  // md.renderer.rules.image

  // Code fences: wrap Shiki's output instead of replacing it
  const shikiFence = md.renderer.rules.fence;
  if (shikiFence) {
    md.renderer.rules.fence = (tokens, idx, options, env, renderer) => {
      const preHtml = shikiFence(tokens, idx, options, env, renderer);
      const lines = [
        preHtml.replace("pre", 'pre slot="pre"'),
        html`<copy-to-clipboard slot="sticky"></copy-to-clipboard>`,
      ];

      return `<mwc-code-block>${lines.join("")}</mwc-code-block>`;
    };
  }
}
