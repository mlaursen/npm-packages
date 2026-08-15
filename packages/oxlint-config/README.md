# @mlaursen/oxlint-config

A reusable oxlint config that I use for most projects.

## Installation

```sh
npm install -D oxlint @mlaursen/oxlint-config
```

Then create an `oxlint.config.ts`:

```ts
import { configs } from "@mlaursen/eslint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [
    configs.recommended,

    // if developing a react app
    configs.frontend,

    // choose either
    configs.vitest,
    configs.jest,

    // if using nextjs
    configs.nextjs,
  ],
});
```
