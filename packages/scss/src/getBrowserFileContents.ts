/** @internal */
export function getBrowserFileContents(
  lookup: Readonly<Record<string, string>>,
  browserBasePath: string,
): string {
  const pretty = JSON.stringify(lookup, (_key, value: unknown) => {
    // sort object keys so it always prints the same
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.fromEntries(
        Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b)),
      );
    }

    return value;
  });

  return `export const SCSS_LOOKUP: Readonly<Record<string, string>> = ${pretty};
export const BASE_PATH = "${browserBasePath}";

export const loadFromScssLookup = (filePath: string): string => {
  const contents = SCSS_LOOKUP[filePath];
  if (!contents) {
    throw new Error(\`File not found: \${filePath}\`);
  }

  return contents;
};
`;
}
