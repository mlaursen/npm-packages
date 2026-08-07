import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const ENABLE_SSR = process.env.ENABLE_SSR === "true";

export const DEFAULT_CSS_BROWSERSLIST_TARGETS = browserslistToTargets(
  browserslist("last 2 versions and not dead and > 0.5%"),
);

export const ROOT_DIR = "src";
export const INCLUDES_DIR = `${ROOT_DIR}/_includes`;
export const DATA_DIR = `${ROOT_DIR}/_data`;
export const ASSETS_DIR = `${ROOT_DIR}/assets`;

export const OUT_DIR = "_site";
export const ASSETS_OUT_DIR = `${OUT_DIR}/assets`;

// relative to eleventy.config.js
export const WC_ROOT = "../../packages/wc";

export const SCSS_DIR = `${ASSETS_DIR}/scss`;
export const SCSS_OUT_DIR = `${INCLUDES_DIR}/css`;

export const SCRIPTS_DIR = `${ASSETS_DIR}/scripts`;
export const SCRIPTS_OUT_DIR = `${INCLUDES_DIR}/scripts`;
