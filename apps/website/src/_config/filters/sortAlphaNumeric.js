const collator = new Intl.Collator("en-US", {
  numeric: true,
  caseFirst: "upper",
});

/**
 * @param {readonly string[]} list
 * @returns {readonly string[]}
 */
export function sortAlphaNumeric(list) {
  return list.toSorted((a, b) => {
    return collator.compare(a, b);
  });
}
