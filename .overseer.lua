-- just for the type definitions
require("overseer")

---@type overseer.TemplateFileDefinition[]
return {
  {
    name = "pnpm build-default-css (@mlaursen/wc)",
    builder = function()
      return {
        cmd = { "pnpm", "--filter", "wc", "build-default-css" },
        cwd = LazyVim.root(),
      }
    end,
  },

  {
    name = "pnpm convert-material-theme (@mlaursen/wc)",
    builder = function()
      return {
        cmd = { "pnpm", "--filter", "wc", "convert-material-theme" },
        cwd = LazyVim.root(),
      }
    end,
  },

  {
    name = "pnpm test-scss (@mlaursen/wc)",
    builder = function()
      return {
        cmd = { "pnpm", "--filter", "wc", "test-scss" },
        cwd = LazyVim.root(),
      }
    end,
  },
}
