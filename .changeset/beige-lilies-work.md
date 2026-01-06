---
"@mlaursen/eslint-config": major
---

Providing the `tsconfigRootDir` option no longer automatically enables the strict typescript-eslint rules to support monorepo setups. Enable the new `strictTypeChecked` option along with providing the `tsconfigRootDir`.
