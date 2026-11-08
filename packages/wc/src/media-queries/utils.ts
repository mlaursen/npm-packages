import { DEFAULT_BREAKPOINTS } from "./constants.js";
import type {
  GetNamedMediaQueries,
  MediaQueryName,
  MediaQueryNameOrQuery,
  NamedMediaQueries,
} from "./types.js";

const {
  phoneMaxWidth,
  tabletMinWidth,
  tabletMaxWidth,
  desktopMinWidth,
  largeDesktopMinWidth,
} = DEFAULT_BREAKPOINTS;

/**
 * @internal
 */
export function getDefaultNamedMediaQueries(): NamedMediaQueries {
  const screenAnd = "screen and";
  const tabletQuery = `${screenAnd} (min-width: ${tabletMinWidth})`;
  return {
    phone: `${screenAnd} (max-width: ${phoneMaxWidth})`,
    tablet: tabletQuery,
    "tablet-only": `${tabletQuery} and (max-width: ${tabletMaxWidth})`,
    desktop: `${screenAnd} (min-width: ${desktopMinWidth})`,
    "large-desktop": `${screenAnd} (min-width: ${largeDesktopMinWidth})`,
  };
}

/**
 * @internal
 */
export function isNamedMediaQuery(
  query: string,
  queries: NamedMediaQueries,
): query is MediaQueryName {
  return (
    query in queries && typeof queries[query as MediaQueryName] === "string"
  );
}

/**
 * @internal
 */
export function createMediaQuery(
  queryOrName: MediaQueryNameOrQuery | null,
  getNamedMediaQueries: GetNamedMediaQueries = getDefaultNamedMediaQueries,
): MediaQueryList | null {
  if (!queryOrName || typeof globalThis.matchMedia !== "function") {
    return null;
  }

  const queries = getNamedMediaQueries();
  const query = isNamedMediaQuery(queryOrName, queries)
    ? queries[queryOrName]
    : queryOrName;

  return globalThis.matchMedia(query);
}
