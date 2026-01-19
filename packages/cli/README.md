# @mlaursen/cli

A small util to copy scss files for publishing.

## Installation

```sh
npm install -D @mlaursen/cli
```

## Usage

The cli is setup to work with my general setup so defaults to finding all
`.scss` files in the `src` directory and copies them to a `dist` directory
maintaining folder structure.

My normal setup is:

```diff
   "scripts": {
     "clean-dist": "rm -rf dist",
     "clean-cache": "rm -rf .turbo node_modules",
     "clean": "concurrently 'pnpm clean-dist' 'pnpm clean-cache'",
     "build-esm": "swc -d ./dist --strip-leading-paths src",
     "build-esm-watch": "pnpm build-esm --watch",
     "build-types": "tsc -P tsconfig.types.json",
     "build-types-watch": "pnpm build-types --watch",
-    "build": "concurrently 'pnpm build-esm' 'pnpm build-types'",
+    "build-scss": "mlaursen-cli copy-scss-files",
+    "build-scss-watch": "mlaursen-cli copy-scss-files --watch",
+    "build": "concurrently 'pnpm build-esm' 'pnpm build-types' 'pnpm build-scss'",
   },
```

If files need to also be copied to the root so they can be used before the main
import:

```sh
mlaursen-cli copy-scss-files -r "_file1.scss" -r "_file2.scss"
mlaursen-cli copy-scss-files -r "_file1.scss" -r "_file2.scss" --watch
```

Help and other info can be printed as needed:

```sh
npx mlaursen-cli -h

npx mlaursen-cli copy-scss-files -h
```
