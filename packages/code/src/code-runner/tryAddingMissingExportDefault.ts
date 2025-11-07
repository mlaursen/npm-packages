/**
```ts
const FIRST_STATEMENT_REGEXP = new RegExp(String.raw`
  ^(\s*)                  # capture any leading whitespace             (group 1)
  (                       # captures the first statement by finding:   (group 2)
    <[^>]*>               # a tag/fragment
    |function[\s]         # a function declaration
    |\(\)[\s=]            # an arrow function declaration
    |class\s              # a class declaration
  )
  (.*)                  # capture the tag name                         (group 3)
`.replace(/\s+#.*$/gm, '').replace(/\s+/g, ''), "i");
```
 *
 * Groups: 1=leadingWhitespace, 2=firstStatement, 3=remainingCode
 */
const FIRST_STATEMENT_REGEXP =
  /^(\s*)(<[^>]*>|function[(\s]|\(\)[\s=]|class\s)(.*)/;

/**
 * @internal
 */
export function tryAddingMissingExportDefault(code: string): string {
  if (/^export default /m.test(code)) {
    return code;
  }

  return code.replace(FIRST_STATEMENT_REGEXP, "$1export default $2$3");
}
