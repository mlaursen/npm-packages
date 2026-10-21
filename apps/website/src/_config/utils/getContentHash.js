import { createHash } from "node:crypto";

/**
 * @param {string} contents
 * @returns {string}
 */
export function getContentHash(contents) {
  return createHash("sha256").update(contents).digest("hex").slice(0, 8);
}
