import {
  createWatcher,
  disableLogger,
  enableLogger,
  log,
  logComplete,
  logFailure,
  logPending,
  logTask,
  prettyFilesize,
} from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import browserslist from "browserslist";
import { glob } from "glob";
import { browserslistToTargets, transform } from "lightningcss";
import { existsSync, readFileSync } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import { format } from "prettier";

import type { ColorScheme } from "../src/palette/types.js";

const basePath = process.cwd();
const watching = process.argv.includes("--watch");
const production = process.argv.includes("--prod");
const targets = browserslistToTargets(
  browserslist("last 2 versions and not dead and > 0.5%"),
);

const colorScheme = ((): ColorScheme => {
  if (process.argv.includes("--light")) {
    return "light";
  }

  if (process.argv.includes("--dark")) {
    return "dark";
  }

  if (process.argv.includes("--system")) {
    return "system";
  }

  return "light-dark";
})();

function loadConfigureFile(): string {
  return `@use "../src" as *;

@include configure(
  $palette: (
    color-scheme: ${colorScheme}
  )
);
`;
}

const load = (filePath: string): string => {
  if (/scripts\/configure/.test(filePath)) {
    return loadConfigureFile();
  }

  return readFileSync(filePath, "utf8");
};

const TOKENS_MESSAGE =
  "The following tokens do not exist and need to be removed or fixed: ";
const VALID_TOKENS_MESSAGE = ". Valid tokens are: ";

async function createStyles(filePath: string): Promise<void> {
  const code = `
@use "src/index" as ui;
@use "scripts/configure";

@use "${filePath}";

@include ui.verify-tokens;
`;

  try {
    const result = compileScss({
      code,
      load,
      basePath,
    });
    let { css } = result;
    if (production) {
      const minified = transform({
        code: Buffer.from(css, "utf8"),
        minify: true,
        filename: filePath,
        targets,
      });

      css = minified.code.toString();
    }

    css = await format(css, {
      parser: "css",
      plugins: ["prettier-plugin-css-order"],
      cssDeclarationSorterOrder: "alphabetical",
    });

    let styles = `
import { css } from "lit";

export default css\`${css}\`
`;
    if (!production) {
      styles = await format(styles, { parser: "typescript" });
    }

    const outFile = filePath.replace(".scss", "-styles.ts");
    await writeFile(outFile, styles, "utf8");
    logComplete(
      `wrote "${outFile.replace(basePath, "")}" (${prettyFilesize(styles)})`,
    );
  } catch (error) {
    enableLogger();
    logFailure(`Unable to compile ${filePath.replace(basePath, "")}.`);

    const err = error instanceof Error ? error : new Error(String(error));
    const startIndex = err.message.indexOf(TOKENS_MESSAGE);
    const validIndex = err.message.indexOf(VALID_TOKENS_MESSAGE);
    const quoteIndex = err.message.indexOf('"', validIndex);

    // make the verify-tokens call prettier since sass error doesn't support
    // newlines
    if (startIndex !== -1 && validIndex !== -1) {
      const invalid = err.message
        .slice(startIndex + TOKENS_MESSAGE.length, validIndex)
        .split(" ");
      const valid = err.message
        .slice(validIndex + VALID_TOKENS_MESSAGE.length, quoteIndex)
        .split(" ");

      const message = `The following tokens are invalid:
${invalid.map((token) => `   - ${token}`).join("\n")}

   Choose one of:
${valid.map((token) => `   - ${token}`).join("\n")}
${err.message.slice(quoteIndex + 1)}
`;
      if (watching) {
        logFailure(message);
      } else {
        throw new Error(message);
      }
    } else if (watching) {
      logFailure(err.message);
    } else {
      throw error;
    }
  }
}

if (watching) {
  enableLogger();
  logPending(`Using ${colorScheme} color scheme for styles`);
  disableLogger();

  const isPartial = (filePath: string): boolean => filePath.includes("_");
  const rebuild = new Set<string>();
  createWatcher({
    watchPath: "src",
    ignored: (path, stats) => !!stats?.isFile() && !/\.scss$/.test(path),
    onRemove: async (filePath) => {
      log(`Removed ${filePath}`);
      rebuild.delete(filePath);
      if (existsSync(filePath)) {
        await rm(filePath, { recursive: true });
      }
    },
    onAddOrChange: async (filePath, ready) => {
      if (isPartial(filePath)) {
        if (ready) {
          const promises: Promise<void>[] = [];
          for (const file of rebuild) {
            promises.push(createStyles(file));
          }

          await Promise.all(promises);
        }
        return;
      }

      rebuild.add(filePath);
      await createStyles(filePath);
    },
  });
} else {
  enableLogger();
  const run = async (): Promise<void> => {
    const styles = await glob("src/**/*.scss", {
      ignore: ["**/_*.scss"],
    });
    await Promise.all(styles.map((filePath) => createStyles(filePath)));
  };

  logTask(
    run(),
    `Compiling ${colorScheme} color scheme styles`,
    `Compiled ${colorScheme} color scheme styles`,
  );
}
