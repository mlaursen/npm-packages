/**
 * Simple html escape
 *
 * @param {number|string|unknown} value
 * @returns {string}
 */
export const escapeAttribute = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
