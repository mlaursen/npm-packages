# @mlaursen/node-utils

## 0.4.0

### Minor Changes

- e33bc07: Added a simple importOptional util for importing optional peer dependencies
- c5dc182: Stopped using dotenv and created a small loadConfigFile wrapper for the process.loadConfigFile. No longer trust that package after the v1000 release of dotenv-expand and requiring hiding the ads.

### Patch Changes

- 72ed725: Bumped pretty-ms and pretty-bytes to latest
- 468ac7c: Bump chokidar from v5 to v6
- 7108974: Added the sideEffects field to package.json

## 0.3.2

### Patch Changes

- f6a9fa5: Fixed pnpm not handling wildcards correctly like npm in .npmignore

## 0.3.1

### Patch Changes

- 8a69ab0: Bumped dependencies to latest
- 8e5988e: Added jsdoc to define the default values for the generateFile options
- 43dd977: Updated watching message to be "Watching for file changes" to match tsc instead of "Watching changes..."
- 2796c3a: Updated the generateFile util to use oxfmt instead of prettier

## 0.3.0

### Minor Changes

- 354aadf: Added a quiet option to hide additional logs
- 929fdc5: Added a getGitRoot util
- ece0d3f: Added a touch file utility

### Patch Changes

- f19a99d: generateFile now ensures the file's parent directories
- 73dbbc5: Bumped dependencies to latest

## 0.2.1

### Patch Changes

- bb829fe: Bumped dependencies to latest

## 0.2.0

### Minor Changes

- 1d77e7f: Added a generateFile util

## 0.1.0

### Minor Changes

- ca975c4: Added a ready flag for the onAddOrChange callback

### Patch Changes

- c7412e8: Updated createWatcher to return the watcher instance

## 0.0.2

### Patch Changes

- 0a5e1b2: Updated to use the new @mlaursen/node-utils package
