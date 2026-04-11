local ls = require("luasnip")
local util = require("vim-react-snippets.util")

local s = ls.snippet
-- local sn = ls.snippet_node
-- local d = ls.dynamic_node
local t = ls.text_node

return {
  s({
    trig = "lit",
    desc = "create lit styles",
  }, {
    t({ '@use "sass:map";', "" }),
    t({ "", "" }),

    t({ '@use "../utils";', "" }),
    t({ "", "" }),

    t({ "$-tokens-registered: false;", "" }),
    t({ "$-tokens: ();", "" }),
    t({ "", "" }),

    t({ "$-configure-tokens: map.keys($-tokens);", "" }),
    t({ "", "" }),
    t({ "$-styles: (", "" }),
    t({ "\tbase: ()", "" }),
    t({ ");", "" }),
    t({ "", "" }),

    t({ "@mixin configure() {", "" }),
    t({ "\t@if not $-tokens-registered {", "" }),
    t({ "\t\t$-tokens-registered: true !global;", "" }),
    t('\t\t@include utils.register-tokens($tokens: $-tokens, $prefix: "'),
    util.current_folder(1),
    t({ '");', "" }),
    t({ "\t}", "" }),
    t({ "}", "" }),
    t({ "", "" }),

    t({ "@mixin configure-global($overrides: null) {", "" }),
    t("\t$overrides: utils.get-config-map("),
    util.mirror_node(1),
    t({ ", $overrides, $-configure-tokens);", "" }),
    t({ "\t@include configure();", "" }),
    t({ "}", "" }),
    t({ "", "" }),

    t({ "@mixin css-styles {", "" }),
    t({ "\t$styles: ();", "" }),
    t({ "\t@include utils.map-to-styles($styles);", "" }),
    t({ "}", "" }),
    t({ "", "" }),

    t({ "@mixin host-styles {", "" }),
    t({ "\t$styles: ();", "" }),
    t({ "\t@include utils.map-to-styles($styles);", "" }),
    t({ "}", "" }),
    t({ "", "" }),

    t({ "@mixin styles {", "" }),
    t({ "\t@include utils.css-styles {", "" }),
    t({ "\t\t@include css-styles;", "" }),
    t({ "\t}", "" }),
    t({ "", "" }),
    t({ "\t@include utils.host-styles {", "" }),
    t({ "\t\t@include host-styles;", "" }),
    t({ "\t}", "" }),
    t({ "}", "" }),
  }),
}
