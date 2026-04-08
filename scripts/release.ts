import { release } from "../packages/release-script/src/release.js";

await release({
  repo: "npm-packages",
  buildCommand: "build-dist",
  cleanCommand: "clean-dist",
  packagePaths: {
    "@mlaursen/cli": "./packages/cli",
    "@mlaursen/copy-scss-files": "./packages/copy-scss-files",
    "@mlaursen/eslint-config": "./packages/eslint-config",
    "@mlaursen/node-utils": "./packages/node-utils",
    "@mlaursen/release-script": "./packages/release-script",
    "@mlaursen/scss": "./packages/scss",
    "@mlaursen/simple-docs": "./packages/simple-docs",
    "@mlaursen/utils": "./packages/utils",
  },
});
