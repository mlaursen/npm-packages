import slugifyDefault from "slugify";

/**
 * @param {string} str
 * @returns {string}
 */
export const slugify = (str) =>
  slugifyDefault(str, {
    replacement: "-",
    remove: /[#,&,+()$~%.'":*┬┐?┬í!<>{}]/g,
    lower: true,
  });
