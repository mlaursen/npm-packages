# @mlaursen/eslint-config

A reusable eslint config that I use for most of my projects.

Starting at `5.0.0`, I only support `eslint@^9` or greater.

## Installation

```sh
npm install -D eslint @mlaursen/eslint-config
```

Then create an `eslint.config.mjs` with one of the following:

```js
// @ts-check
import { configs, gitignore } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  gitignore(import.meta.url),
  ...configs.recommendedFrontend({
    // Optional: enable additional react-refresh eslint rules
    reactRefresh: "vite",
    // reactRefresh: "next",
    // reactRefresh: "recommended",

    // Optional: enable additional react-compiler eslint rules
    reactCompiler: true,

    // Optional: defaults to `"vitest"`
    testFramework: "jest",

    // Optional: enables strict type checking with tsc (slower)
    tsconfigRootDir:
      process.env.STRICT_TYPING === "true" ? import.meta.dirname : undefined,
  }),
]);
```

```js
import { configs, gitignore } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  gitignore(import.meta.url),
  ...configs.recommended({
    // Optional: defaults to `"vitest"`
    testFramework: "jest",

    // Optional: enables strict type checking with tsc (slower)
    tsconfigRootDir:
      process.env.STRICT_TYPING === "true" ? import.meta.dirname : undefined,
  }),
]);
```

## Next.js Setup

This is no longer included in this eslint-config since it requires the eslint
plugin to be installed in the project to work. Here are the setup steps:

```sh
npm install -D @next/eslint-plugin-next
yarn add -D @next/eslint-plugin-next
pnpm add -D @next/eslint-plugin-next
```

### Next.js >= 16

```diff
 import { configs, gitignore } from "@mlaursen/eslint-config";
 import { defineConfig } from "eslint/config";
+import nextPlugin from "@next/eslint-plugin-next";

 // somewhat strict type checking
 export default defineConfig([
+  nextPlugin.configs["core-web-vitals"],
   gitignore(import.meta.url),
   ...configs.recommendedFrontend(),
 ]);
```

### Next.js < 16

```diff
 // @ts-check
+import { FlatCompat } from "@eslint/eslintrc";
 import { configs, gitignore } from "@mlaursen/eslint-config";
 import { defineConfig } from "eslint/config";

+const compat = new FlatCompat({
+  baseDirectory: import.meta.dirname,
+});
+

 // somewhat strict type checking
 export default defineConfig([
   gitignore(import.meta.url),
+  ...compat.config({
+    extends: ["plugin:@next/next/recommended"],
+    // or with core-web-vitals
+    // extends: ["plugin:@next/next/core-web-vitals"],
+  }),
   ...configs.recommendedFrontend(),
 ]);
```

## Configs

I normally just use the `recommended` or `recommendedFrontend` configs, but the
others can be used individually if needed.

<!-- toc -->

- [recommended](#recommended)
- [recommendedFrontend](#recommendedfrontend)
- [base](#base)
- [scripts](#scripts)
- [typescript](#typescript)
- [testing](#testing)
- [jest](#jest)
- [jestDom](#jestdom)
- [vitest](#vitest)
- [testingLibraryReact](#testinglibraryreact)
- [testingLibraryDom](#testinglibrarydom)
- [react](#react)
- [jsxA11y](#jsxa11y)
- [unicorn](#unicorn)

<!-- tocstop -->

### recommended

```js
// @ts-check
import { configs, gitignore } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  gitignore(import.meta.dirname),
  ...configs.recommended({ testFramework: "jest" }),
]);

// or with strict type checking
export default defineConfig([
  gitignore(import.meta.dirname),
  ...configs.recommended({
    testFramework: "jest",
    tsconfigRootDir: import.meta.dirname,
  }),
]);
```

### recommendedFrontend

```js
// @ts-check
import { configs, gitignore } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  gitignore(import.meta.dirname),
  ...configs.recommendedFrontend({
    reactRefresh: "next",
    reactCompiler: true,
    testFramework: "jest",
  }),
]);

// or with strict type checking
export default defineConfig([
  gitignore(import.meta.dirname),
  ...configs.recommendedFrontend({
    reactRefresh: "next",
    reactCompiler: true,
    testFramework: "jest",
    tsconfigRootDir: import.meta.dirname,
  }),
]);
```

### base

The base config is automatically used by the [typescript](#typescript) config
and is just the `eslint.configs.recommended` and a few other stylistic changes.

> This should not be used if the [typescript](#typescript) config is used.

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.base);
```

### scripts

The scripts config is used to allow `console.log()` functions in `scripts/**`:

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([...configs.base, ...configs.scripts]);
```

### typescript

This extends the [base](#base) config and the `tseslint.configs.strict` config.
It also includes a few stylistic choices for type behavior and disabled strict
rules in test files.

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.typescript());

// or with strict type checking
export default defineConfig(
  configs.typescript({ tsconfigRootDir: import.meta.dirname })
);
```

### testing

This enables the [jest](#jest) or [vitest](#vitest) rules along with [jestDom](#jestdom).

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.testing({ testFramework: "jest" }));

// or vitest
export default defineConfig(configs.testing({ testFramework: "vitest" }));
```

### jest

This only enables the `eslint-plugin-jest.configs["flat/recommended"]` rules on
tests files and should not be used if using [testing](#testing).

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.jest);
```

### jestDom

This only enables the `eslint-plugin-jest-dom.configs["flat/recommended"]` rules
on tests files and should not be used if using [testing](#testing).

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.jestDom);
```

### vitest

This only enables the `@vitest/eslint-plugin` rules on test files and should not
be used if using [testing](#testing).

### testingLibraryReact

This enables the `eslint-plugin-testing-library/.configs["flat/react"]` plugin
and rules on test files.

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.vitest);
```

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.testingLibraryReact);
```

### testingLibraryDom

This enables the `eslint-plugin-testing-library/.configs["flat/dom"]` plugin and
rules on test files.

> This should **not** be used with the
> [testingLibraryReact](#testinglibraryreact) rules

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.testingLibraryDom);
```

### react

This enables the `eslint-plugin-react` and `eslint-plugin-react-hooks`:

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.react());

// or with the react compiler rules enabled
export default defineConfig(configs.react(true));
```

### jsxA11y

This enables `eslint-plugin-jsx-a11y`:

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.jsxA11y);
```

### unicorn

This enables some rules from `eslint-plugin-unicorn`:

```js
// @ts-check
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(configs.unicorn);
```
