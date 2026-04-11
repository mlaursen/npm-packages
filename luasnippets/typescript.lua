local ls = require("luasnip")
local util = require("vim-react-snippets.util")

local s = ls.snippet
local sn = ls.snippet_node
local d = ls.dynamic_node
local t = ls.text_node
-- local i = ls.insert_node
-- local f = ls.function_node

return {
  s({
    trig = "lit",
    desc = "create lit component",
  }, {
    t({ 'import { LitElement, html, type TemplateResult } from "lit";', "" }),
    t({ 'import { customElement, property } from "lit/decorators.js";', "" }),
    t({ "", "" }),
    t('import styles from "./'),
    util.current_filename(1),
    t({ '-styles.js";', "" }),
    t({ "", "" }),

    t({ '@customElement("' }),
    d(2, function()
      return sn(nil, {
        t("ui-" .. vim.fn.expand("%:t:r")),
      })
    end),
    t({ '")', "" }),
    t("export class "),
    d(3, function()
      return sn(nil, {
        t(util.pascal_case(vim.fn.expand("%:t:r"))),
      })
    end),
    t({ " extends LitElement {", "" }),
    t({ "\tstatic override styles = styles;", "" }),
    t({ "", "" }),
    t({ "\toverride render(): TemplateResult {", "" }),
    t({ "\t\treturn html`<slot></slot>`;", "" }),
    t({ "\t}", "" }),
    t({ "}", "" }),
    t({ "", "" }),
    t({ "declare global {", "" }),
    t({ "\tinterface HTMLElementTagNameMap {", "" }),
    t('\t\t"'),
    util.mirror_node(2),
    t('": '),
    util.mirror_node(3),
    t({ ";", "" }),
    t({ "\t}", "}" }),
  }),
}
