import { release } from "../packages/release-script/src/release.js";

await release({
  repo: "npm-packages",
  cleanCommand: "clean-dist",
  packagePaths: {
    "@mlaursen/cli": "./packages/cli",
    "@mlaursen/code": "./packages/code",
    "@mlaursen/copy-scss-files": "./packages/copy-scss-files",
    "@mlaursen/eslint-config": "./packages/eslint-config",
    "@mlaursen/release-script": "./packages/release-script",
  },
});
