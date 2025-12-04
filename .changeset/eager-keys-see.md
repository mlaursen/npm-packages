---
"@mlaursen/eslint-config": major
---

# Breaking changes

- Removed the, `frontend`, `frontendTypeChecking`, `minimal`, and
  `typescriptTypeChecking` configs
- The `typescript` config is now a function
- The `testing` config function uses an optional object parameter instead of
  the single `TestFramework`

## Features

- Added `recommended` and `recommendedFrontend` config generators to replace
  `frontend`, `frontendTypeChecking`, `minimal`, and `typescriptTypeChecking`
- Allow swapping configs through a single entry point using options
- Added support for `react-refresh` eslint rules
