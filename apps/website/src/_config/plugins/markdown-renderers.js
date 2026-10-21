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
const HEADINGS = {
  h1: ["small", "display"],
  h2: ["large", "headline"],
  h3: ["medium", "headline"],
  h4: ["small", "headline"],
  h5: ["large", "title"],
  h6: ["medium", "title"],
};

/** @param {import("markdown-it").MarkdownIt} md */
export function markdownRenderers(md) {
  md.renderer.rules.paragraph_open = () => "<mwc-typography><p>";
  md.renderer.rules.paragraph_close = () => "</p></mwc-typography>";
  md.renderer.rules.heading_open = (tokens, idx) => {
    const token = tokens[idx];
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
    return `</${token.tag}></mwc-typography>`;
  };

  // md.renderer.rules.blockquote_open = (tokens, idx, options, env, renderer) => {};
  // md.renderer.rules.blockquote_close = (tokens, idx, options, env, renderer) => {};

  md.renderer.rules.link_open = (tokens, idx, _options, _env, renderer) => {
    return `<mwc-link${renderer.renderAttrs(tokens[idx])}>`;
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
  md.renderer.rules.fence = (tokens, i, options, env, self) => {
    const lang = md.utils.escapeHtml(tokens[i].info.trim().split(/\s+/)[0]);
    const inner = shikiFence(tokens, i, options, env, self);
    const lineNumbers = inner.includes("data-line-numbers");

    let counter = "";
    if (lang !== "sh" && inner.split(/\n/).length > 5 && lineNumbers) {
      counter = " shiki-pre-container--counter";
    }

    // NOTE: I eventually want to add a `mwc-code-block` element for this
    const code = [
      '<div class="code-block">',
      '<div class="code-block__scroll-container">',
      `<div class="code-block__pre-container shiki-pre-container${counter}">`,
      inner,
      "</div>",
      "</div>",
      "</div>",
    ];
    return code.join("");
  };
}
