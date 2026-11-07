local ls = require("luasnip")
local util = require("vim-react-snippets.util")

local s = ls.snippet
local i = ls.insert_node
-- local sn = ls.snippet_node
-- local d = ls.dynamic_node
local t = ls.text_node

return {
  s({
    trig = "lit",
    desc = "create lit styles",
  }, {
    t({ '@use "@mlaursen/wc" as *;', "" }),
    t({ "", "" }),

    t({ "$-styles: (", "" }),
    t({ '  ":host": (', "" }),
    t({ "    " }),
    i(0),
    t({ "", "  ),", "" }),
    t({ ");" }),
    t({ "", "" }),
    t({ "$-keyframes: ();", "" }),
    t({ "", "" }),
    t({ "@include host-styles($styles: $-styles, $keyframes: $-keyframes);" }),
  }),
}
