# @mlaursen/simple-docs

A simple package for adding @example typedoc to a README.

## Installation

```sh
npm install -D @mlaursen/simple-docs
```

## Usage

The docs can be created by calling `simple-docs`. Here is an example setup:

```diff
   "scripts": {
     "clean-dist": "rm -rf dist",
     "clean-cache": "rm -rf .turbo node_modules",
     "clean": "concurrently 'pnpm clean-dist' 'pnpm clean-cache'",
     "build-esm": "swc -d ./dist --strip-leading-paths src",
     "build-esm-watch": "pnpm build-esm --watch",
     "build-types": "tsc -P tsconfig.types.json",
     "build-types-watch": "pnpm build-types --watch",
+    "build-docs": "simple-docs",
     "build": "concurrently 'pnpm build-esm' 'pnpm build-types'"
   },
```

Then add the following to the README.md:

```md
<!-- examples-start -->
<!-- examples-end -->
```

The docs will be written in that location.
