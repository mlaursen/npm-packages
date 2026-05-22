import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const DEFAULT_CSS_BROWSERSLIST_TARGETS = browserslistToTargets(
  browserslist("last 2 versions and not dead and > 0.5%"),
);
