# @mlaursen/release-script

This is the normal npm release script I use. This requires:

- [changesets](https://github.com/changesets/changesets) to handle bumping
  versions and generating changelogs.
- A Github [release token](https://github.com/settings/personal-access-tokens)
  - The token only needs repository access
  - This is normally stored as `GITHUB_TOKEN` in an `.env.local` file that
    should not be committed

## Installation

The release script relies on
[changesets](https://github.com/changesets/changesets) to handle bumping
versions and generating changelogs.

```sh
pnpm install --save-dev @mlaursen/release-script \
  @changesets/cli \
  tsx
```

Setup the `.changeset` dir if needed:

```sh
pnpm changeset init
git add .changeset
git add -u
git commit -m "build: setup changesets"
```

## Usage

Create a `scripts/release.ts` file with:

```ts
import { release } from "@mlaursen/release-script";

await release({
  repo: "{{REPO_NAME}}", // i.e. eslint-config

  // if the repo is not under `mlaursen` for some reason
  // owner: "mlaursen",

  // If there is a custom clean command for releases. `clean` is the default
  // cleanCommand: "clean",

  // If there is a custom build command for releases. `build` is the default
  // buildCommand: "build",

  // An optional flag if the build step should be skipped. `!buildCommand` by default
  // skipBuild: process.argv.includes("--skip-build"),

  // If the version message needs to be customized. The following is the default
  // versionMessage: "build(version): version package",

  // An optional `.env` file path that includes the `GITLAB_TOKEN` environment
  // variable.
  // envPath: ".env.local",

  // An optional lookup of package name -> package path in the repo used to
  // find the CHANGELOG.md for each release in a monorepo. Will default to
  // `"."` when omitted.
  // packagePaths: {
  //   "@react-md/core": "./packages/core",
  // },
});
```

Next, update `package.json` to include the release script:

```diff
   "scripts": {
     "prepare": "husky",
     "typecheck": "tsc --noEmit",
     "check-format": "prettier --check .",
     "format": "prettier --write .",
     "clean": "rm -rf dist",
     "build": "tsc -p tsconfig.json",
+    "release": "tsx scripts/release.ts"
   },
```

Finally, run the release script whenever a new release should go out:

```sh
pnpm release
```

## Adding Changesets

During normal development, add changesets and commit them. They will normally
be close to my commit messages which is a bit annoying.

```sh
pnpm changeset
git add .changeset
```

## Alpha Releases

Use the changesets api to enter the pre-release flow:

```sh
pnpm changeset enter pre
```

Once ready to do a real release:

```sh
pnpm changeset exit pre
```
