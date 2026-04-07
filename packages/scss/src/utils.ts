/**
 * This is mostly internal, but this is how the "unique" class name is generated
 * when using fake css modules
 *
 * @example Simple Example
 * ```ts
 * getFakeCssModuleClassName("./ExampleFile.scss", "container")
 * ```
 *
 * @param fileName The file name use in the prefix
 * @param key This is normally the class name without a "."
 * @returns the fake css module class name
 */
export function getFakeCssModuleClassName(
  fileName: string,
  key: string
): string {
  const prefix = `${fileName}_${key}`;
  const hash = btoa(prefix).slice(0, 5);
  return `${prefix}__${hash}`;
}

/**
 * This is a way to create fake css modules usable in documentation sites.
 *
 * @example Simple Example
 * ```tsx
 * const styles = createFakeCssModules("./ExampleFile.scss");
 *
 * <div className={styles.container}>{children}</div>
 * ```
 *
 * @param fileName The fileName for the fake css module file which is used in
 * generating the class name
 * @returns a proxy object for reflecting fake class names
 */
export function createFakeCssModules(fileName: string): Record<string, string> {
  return new Proxy(
    {},
    {
      get(_target, key) {
        if (key === "__esModule") {
          return false;
        }

        if (typeof key === "string") {
          return getFakeCssModuleClassName(fileName, key);
        }

        return "";
      },
    }
  );
}
