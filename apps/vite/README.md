# vite

This is a [vite] playground to test out packages.

## Commands

- `clean` - cleans everything by running `clean-dist` and `clean-cache`
  - `clean-dist` - only removes the vite generated files
  - `clean-cache` - removes the `.turbo` and `node_modules`
- `format` - format all files with prettier
  - `check-format` - check the format for all files (mostly for CI)
- `lint` - run `eslint` on all files
  - `lint-fix` - run `eslint --fix` on all files
- `typecheck` - run `tsc -b --noEmit` to check for type errors
  - Note: strict rules enforced
- `test` - run tests with [vitest]
  - `test-coverage` - run tests with code coverage
- `dev` - run the vite dev server
- `build` - build for production
- `preview` - run the production website in preview mode with `vite`

## React Compiler Commands

The following commands will use the [react-compiler] instead of [swc] to
compile the code.

- `test-compiler` - run tests with vitest
  - `test-coverage-compiler` - run tests with code coverage
- `dev-compiler` - run the vite dev server
- `build-compiler` - build for production

[vite]: https://vite.dev
[vitest]: https://vitest.dev
[react-compiler]: https://react.dev/learn/react-compiler
