# @mlaursen/release-script

## 0.1.0

### Minor Changes

- e35f6f6: Allow packages to always be ignored in github releases

### Patch Changes

- 342e2a1: Fixed the spelling of "manager", getting the packageManager from the package.json, and requires at least one pending release before continuing.
- 5b28005: No longer require a confirmation for packages that manually set the CHANGELOG.md path

## 0.0.8

### Patch Changes

- c1f2d4f: Fixed the incorrect type mapping

## 0.0.7

### Patch Changes

- a65f372: Updated the release flow to better support the correct changesets CLI. It no longer creates a changeset at the publish stage

## 0.0.6

### Patch Changes

- BREAKING CHANGES
  - Default token name is now `GITHUB_RELEASE_TOKEN` instead of `GITHUB_TOKEN`

  Features
  - Added `tokenName` option with defaults to `GITHUB_RELEASE_TOKEN`

  Bug fixes
  - Continue release should correctly stall until accepted

## 0.0.5

### Patch Changes

- Added suupport for repos that do not have a build step

## 0.0.4

### Patch Changes

- Fixed monorepos failing since there is no root CHANGELOG.md.

## 0.0.3

### Patch Changes

- Hopefully fixed reusing existing tags instead of creating a new tag for Github releases.

## 0.0.2

### Patch Changes

- Hopefully fixed the remaining issues.

## 0.0.1

### Patch Changes

- The first release. Let's see if it works!
