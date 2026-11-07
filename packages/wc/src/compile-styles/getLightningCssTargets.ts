import { importOptional } from "@mlaursen/node-utils";
import type * as lightningcssModule from "lightningcss";
import type { Targets } from "lightningcss";

import { FEATURE_NAME } from "./constants.js";

export async function getLightningCssTargets(
  lightningcss: typeof lightningcssModule,
  targets: Targets | undefined,
): Promise<Targets> {
  if (targets) {
    return targets;
  }

  // can't use namespace import since it isn't ESM
  // oxlint-disable-next-line typescript/consistent-type-imports
  const browserslist = await importOptional<typeof import("browserslist")>(
    "browserslist",
    FEATURE_NAME,
  );

  return lightningcss.browserslistToTargets(
    browserslist("last 2 versions and not dead and > 0.5%"),
  );
}
