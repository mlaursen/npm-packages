/**
 * This is mostly internal, but this is how the "unique" class name is generated
 * when using fake css modules
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
 * This is a way to create fake css modules with the `useDangerousCodeRunner`
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
