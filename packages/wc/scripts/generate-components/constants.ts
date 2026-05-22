import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export const DEFAULT_CSS_BROWSERSLIST_TARGETS = browserslistToTargets(
  browserslist("last 2 versions and not dead and > 0.5%"),
);

export const TOKENS_MESSAGE =
  "The following tokens do not exist and need to be removed or fixed: ";
export const VALID_TOKENS_MESSAGE = ". Valid tokens are: ";
