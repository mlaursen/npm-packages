import { glob } from "glob";
import { resolve } from "node:path";

import { DEFAULT_CSS_BROWSERSLIST_TARGETS } from "./constants.js";
import { createStyles } from "./createStyles.js";
import { type GenerateComponentsOptions } from "./types.js";

export async function generateComponents(
  options: GenerateComponentsOptions = {},
): Promise<void> {
  const {
    colorScheme = "light-dark",
    output = "flagged",
    basePath = process.cwd(),
    targets = DEFAULT_CSS_BROWSERSLIST_TARGETS,
    sassOptions,
    shortVarNames = output === "minified",
  } = options;

  const styles = await glob("src/**/*.scss", {
    ignore: ["**/_*.scss"],
    cwd: resolve(import.meta.dirname, "../.."),
  });
  await Promise.all(
    styles.map((filePath) =>
      createStyles({
        colorScheme,
        filePath,
        basePath,
        output,
        sassOptions,
        targets,
        shortVarNames,
      }),
    ),
  );
}
