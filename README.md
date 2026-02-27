# npm-packages

This is a for all the packages I publish under the `@mlaursen` scope.

- [@mlaursen/cli](./packages/cli)
- [@mlaursen/copy-scss-files](./packages/copy-scss-files)
- [@mlaursen/eslint-config](./packages/eslint-config)
- [@mlaursen/release-script](./packages/release-script)

## Release Flow

Add changesets for each working change. This should generally be one package at
a time:

```sh
pnpm changeset
```

Commit the changeset as a separate commit or with related work.

When ready to create a release:

```sh
pnpm changeset version
git add -u
git commit -m "build(version): version package"
pnpm changeset publish
git push --follow-tags
```

Then manually create a release in Github for the tag. I will need to look into
a way for the `createRelease` script to handle this in
`@mlaursen/release-script` now that I understand changesets a bit more.
