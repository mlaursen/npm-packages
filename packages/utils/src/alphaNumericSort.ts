export const DEFAULT_COLLATOR_OPTIONS = {
  numeric: true,
  caseFirst: "upper",
} as const satisfies Intl.CollatorOptions;

/**
 * The default `Intl.Collator` that should be used for sorting large lists.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#performance
 */
export const DEFAULT_COLLATOR = new Intl.Collator(
  "en-US",
  DEFAULT_COLLATOR_OPTIONS,
);

function defaultExtractor(item: unknown): string {
  if (typeof item === "string") {
    return item;
  }

  if (item && typeof item === "object") {
    if ("label" in item && typeof item.label === "string") {
      return item.label;
    }

    if ("name" in item && typeof item.name === "string") {
      return item.name;
    }
  }

  throw new Error(
    `\`alphaNumericSort\` requires the \`extractor\` option for lists that do not contain strings or known object types.`,
  );
}

/**
 * A function to get a string from a generic item.
 *
 * @example Simple Example
 * ```ts
 * interface Item {
 *   name: string;
 * }
 *
 * const items: Item[] = [{ name: 'Hello' }, { name: 'World' }];
 *
 * const extractor: TextExtractor<Item> = (item) => item.name;
 * ```
 */
export type TextExtractor<T> = (item: T) => string;

/**
 * - `"some value"` -&gt; `"some value"`
 * - `{ label: "Hello, world", value: 300 }` -&gt; `"Hello, world!"`
 * - `{ name: "Hello, world", value: 300 }` -&gt; `"Hello, world!"`
 */
export type AutomaticTextExtraction =
  | string
  | { label: string }
  | { name: string };

export interface AlphaNumericSortOptions<T> {
  /**
   * The extractor is only required when the list of items are not strings.
   *
   * @example Simple Example
   * ```ts
   * interface Item {
   *   nameField: string;
   * }
   *
   * const items: Item[] = [{ nameField: 'Hello' }, { nameField: 'World' }];
   *
   * alphaNumericSort(items, {
   *   extractor: (item) => item.nameField,
   * });
   * ```
   *
   * For javascript developers, this will throw an error in dev mode if an
   * extractor is not provided for non-string lists.
   *
   * @defaultValue {@link AutomaticTextExtraction}
   */
  extractor?: TextExtractor<T>;

  /**
   * A custom compare function for sorting the list. This should really only be
   * provided if the language for your app is not `"en-US"` or you'd like to
   * provide some custom sorting options.
   *
   * @example Custom Compare using Intl.Collator
   * ```ts
   * const collator = new Intl.Collator("en-US", {
   *   numeric: false,
   *   caseFirst: "lower",
   *   usage: "search",
   * });
   *
   * alphaNumericSort(items, {
   *   compare: collator.compare,
   * })
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator
   * @defaultValue `new Intl.Collator("en-US", { numeric: true, caseFirst: "upper" }).compare`
   */
  compare?: (a: string, b: string) => number;

  /**
   * Setting this to `true` will return the list in descending order instead of
   * ascending.
   *
   * @defaultValue `false`
   */
  descending?: boolean;
}

/**
 * @example Simple Example
 * ```ts
 * const items = ["World", "Hello"];
 *
 * const sorted = alphaNumericSort(items);
 * // sorted == ["Hello", "World"]
 * ```
 *
 * @param list - The list of strings to sort
 * @returns a new sorted list
 */
export function alphaNumericSort<T extends AutomaticTextExtraction>(
  list: readonly T[],
  options?: AlphaNumericSortOptions<T>,
): readonly T[];
/**
 * @example Simple Example
 * ```ts
 * interface Item {
 *   nameField: string;
 * }
 *
 * const items: Item[] = [{ nameField: "World" }, { nameField: "Hello" }];
 *
 * const sorted = alphaNumericSort(items, {
 *   extractor: (item) => item.nameField,
 * });
 * // sorted == [{ nameField: "Hello" }, { nameField: "World" }]
 * ```
 *
 * @param list - The list of items to sort
 * @returns a new sorted list
 */
export function alphaNumericSort<T>(
  list: readonly T[],
  options: AlphaNumericSortOptions<T> & { extractor: TextExtractor<T> },
): readonly T[];
export function alphaNumericSort<T>(
  list: readonly T[],
  options: AlphaNumericSortOptions<T> = {},
): readonly T[] {
  const {
    compare = DEFAULT_COLLATOR.compare,
    extractor = defaultExtractor,
    descending = false,
  } = options;

  const sorted = [...list];
  sorted.sort((a, b) => {
    const aValue = extractor(a);
    const bValue = extractor(b);

    const value1 = descending ? bValue : aValue;
    const value2 = descending ? aValue : bValue;

    return compare(value1, value2);
  });

  return sorted;
}
