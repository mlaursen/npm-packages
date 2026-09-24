import { release } from "../packages/release-script/src/release.js";

// Since I always forget:
// 1. Make sure I am only logged in to npm
//    - pnpm logout
// 2. Either use npm login or the generic publish token
//    - Generic Publish Token
//      - `npm logout`
//      - `echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc`
//      - `nvim ~/.zshrc.local` to have `export NPM_TOKEN=......`
//      - `reso`
//    - Npm Login
//      - `npm login`
// 3. Publish hopefully works
await release({
  repo: "npm-packages",
  buildCommand: "build-dist",
  cleanCommand: "clean-dist",
  packagePaths: {
    "@mlaursen/cli": "./packages/cli",
    "@mlaursen/copy-scss-files": "./packages/copy-scss-files",
    "@mlaursen/eslint-config": "./packages/eslint-config",
    "@mlaursen/node-utils": "./packages/node-utils",
    "@mlaursen/oxlint-config": "./packages/oxlint-config",
    "@mlaursen/release-script": "./packages/release-script",
    "@mlaursen/scss": "./packages/scss",
    "@mlaursen/simple-docs": "./packages/simple-docs",
    "@mlaursen/utils": "./packages/utils",
  },
});
