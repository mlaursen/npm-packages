import type { ColorScheme } from "../../src/palette/types.js";
import { generateComponents } from "./generate-components.js";
import type { GenerateComponentsOptions } from "./types.js";
import { watcher } from "./watcher.js";

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

const varPrefix = ((): string | undefined => {
  const i = process.argv.indexOf("--var-prefix");
  const varPrefix = process.argv[i + 1];
  if (
    i === -1 ||
    typeof varPrefix !== "string" ||
    varPrefix.trim().length === 0 ||
    varPrefix.indexOf("--")
  ) {
    return;
  }

  return varPrefix;
})();

const minified = process.argv.includes("--minified");
const options: GenerateComponentsOptions = {
  output: minified ? "minified" : "flagged",
  varPrefix,
  colorScheme,
};

if (process.argv.includes("--watch")) {
  watcher(options);
} else {
  await generateComponents(options);
}
