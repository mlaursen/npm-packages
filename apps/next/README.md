# next

This is a [next] playground to test out packages.

## Commands

- `clean` - cleans everything by running `clean-dist` and `clean-cache`
  - `clean-dist` - only removes the nextjs generated files
  - `clean-cache` - removes the `.turbo` and `node_modules`
- `format` - format all files with prettier
  - `check-format` - check the format for all files (mostly for CI)
- `lint` - run `eslint` on all files
  - `lint-fix` - run `eslint --fix` on all files
- `typecheck` - run `tsc -b --noEmit` to check for type errors
  - Note: strict rules enforced
- `test` - run tests with [vitest]
  - `test-coverage` - run tests with code coverage
- `dev` - run the dev server
- `build` - build the app for production
- `start` - run the production build

[next]: https://nextjs.org
[vitest]: https://vitest.dev
