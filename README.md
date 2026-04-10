# npm-packages

This is a for all the packages I publish under the `@mlaursen` scope.

- [@mlaursen/cli](./packages/cli)
- [@mlaursen/copy-scss-files](./packages/copy-scss-files)
- [@mlaursen/eslint-config](./packages/eslint-config)
- [@mlaursen/node-utils](./packages/node-utils)
- [@mlaursen/release-script](./packages/release-script)
- [@mlaursen/scss](./packages/scss)
- [@mlaursen/simple-docs](./packages/simple-docs)
- [@mlaursen/ui](./packages/ui)
- [@mlaursen/utils](./packages/utils)

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
