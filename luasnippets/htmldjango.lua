local ls = require("luasnip")
local util = require("vim-react-snippets.util")

local s = ls.snippet
local i = ls.insert_node
-- local sn = ls.snippet_node
-- local d = ls.dynamic_node
local t = ls.text_node

return {
  s({
    trig = "js",
    desc = "create js import",
  }, {
    t({ '{% js "defer" %}', "" }),
    t({ '{% include "scripts/wc/' }),
    util.current_filename(1),
    t({ '.js" %}', "" }),
    t({ "{% endjs %}", "" }),
  }),
  s({
    trig = "css",
    desc = "create css import",
  }, {
    t({ '{% css "local" %}', "" }),
    t({ '{% include "css/wc/' }),
    util.current_filename(1),
    t({ '.css" %}', "" }),
    t({ "{% endcss %}", "" }),
  }),
}
