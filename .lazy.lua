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
}
