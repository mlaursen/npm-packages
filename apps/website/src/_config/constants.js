import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export const NODE_ENV = process.env.NODE_ENV ?? "(development)";
export const IS_PRODUCTION = NODE_ENV === "production";
export const ENABLE_SSR = process.env.ENABLE_SSR === "true";

export const DEFAULT_CSS_BROWSERSLIST_TARGETS = browserslistToTargets(
  browserslist("last 2 versions and not dead and > 0.5%"),
);

export const ROOT_DIR = "src";
export const SCSS_DIR = `${ROOT_DIR}/assets/scss`;
export const SCSS_OUT_DIR = `${ROOT_DIR}/_includes/css`;

// relative to eleventy.config.js
export const WC_ROOT = "../../packages/wc";
