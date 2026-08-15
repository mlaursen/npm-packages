import deepmerge from "deepmerge";
import type { OxlintConfig } from "oxlint";

export function merge(...configs: readonly OxlintConfig[]): OxlintConfig {
  let mergedConfig: OxlintConfig = {};
  for (const config of configs) {
    mergedConfig = deepmerge(mergedConfig, config);
  }

  return mergedConfig;
}
