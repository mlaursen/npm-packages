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

const minified = process.argv.includes("--minified");
const options: GenerateComponentsOptions = {
  output: minified ? "minified" : "flagged",
  colorScheme,
  quiet: process.argv.includes("-q") || process.argv.includes("--quiet"),
  // shortVarNames: true,
};

if (process.argv.includes("--watch")) {
  watcher(options);
} else {
  await generateComponents(options);
}
