return {
  {
    "nvim-neotest/neotest",
    dependencies = {
      "marilari88/neotest-vitest",
    },
    opts = {
      adapters = {
        ["neotest-vitest"] = {},
      },
    },
  },
  {
    "mlaursen/vim-react-snippets",
    --- @type vim-react-snippets.SetupOptions
    opts = {
      test_framework = "vitest",
      test_renderer_path = "@react-md/core/test-utils",
      -- test_renderer_path = "@/test-utils",
    },
  },
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        vtsls = {
          settings = {
            typescript = {
              tsserver = {
                pluginPaths = {
                  "./node_modules",
                  "./packages/ui/node_modules",
                },
              },
            },
          },
        },
      },
    },
  },
  {
    "L3MON4D3/LuaSnip",
    config = function()
      require("luasnip.loaders.from_lua").load({
        paths = {
          vim.fn.getcwd() .. "/luasnippets",
        },
      })
    end,
  },
}
