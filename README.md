# npm-packages

This is a for all the packages I publish under the `@mlaursen` scope.

- [@mlaursen/cli](./packages/cli)
- [@mlaursen/copy-scss-files](./packages/copy-scss-files)
- [@mlaursen/eslint-config](./packages/eslint-config)
- [@mlaursen/node-utils](./packages/node-utils)
- [@mlaursen/release-script](./packages/release-script)
- [@mlaursen/scss](./packages/scss)
- [@mlaursen/simple-docs](./packages/simple-docs)
- [@mlaursen/utils](./packages/utils)

## Installation

Start by installing [mise](https://mise.jdx.dev/getting-started.html). This is
used to handle the `pnpm` and `node` versions automatically.

Then:

```sh
pnpm i
```

## Commands

This project uses [turborepo](https://turborepo.dev/) to handle the monorepo behavior.

- `format` - format all packages
  - `check-format` - only check format for all packages
- `lint` - runs lint command across all packages
  - `lint-fix` - runs `lint --fix` across all packages
- `typecheck` - runs the type checker across all packages
  - `typecheck-watch` - runs the type checker in watch mode across all packages
- `test` - runs the test command in watch mode across all packages
  - `test-coverage` - runs the test watch command in coverage mode
  - `test-run` - runs all tests and exits
  - `test-run-snapshot` - updates snapshots
  - `test-run-coverage` - runs all tests with coverage and exits
- `build` - build all packages
  - `build-dist` - builds all packages
  - `build-simple-docs` - builds the [@mlaursen/simple-docs] package only
- `clean-dist` - removes the `dist` files for all packages only
- `clean` - runs `clean-other` and `clean-root`
  - `clean-other` - runs the `clean` command in each package removing all
    temporary files like `node_modules`, `.turbo`, and `dist/**`
  - `clean-root` - removes the root `node_modules` and `.turbo` folders
- `release` - runs the release script. Check out the release flow below

## Release Flow

Add changesets for each working change. This should generally be one package at
a time:

```sh
pnpm changeset
```

Commit the changeset as a separate commit or with related work.

When ready to create a release:

```sh
pnpm release
```
