import type { OxlintConfig } from "oxlint";

import { base } from "./base.js";
import { jest } from "./jest.js";
import { jsxA11y } from "./jsxA11y.js";
import { mui } from "./mui.js";
import { nextjs } from "./nextjs.js";
import { react } from "./react.js";
import { scripts } from "./scripts.js";
import { testingLibrary } from "./testingLibrary.js";
import { typescript } from "./typescript.js";
import { unicorn } from "./unicorn.js";
import { vitest } from "./vitest.js";

export interface CreateConfigOptions {
  jsx?: "react" | "next" | boolean;
  overrides?: OxlintConfig;
  testFramework?: "vitest" | "jest" | null;
}

export function createConfig({
  jsx,
  overrides,
  testFramework,
}: CreateConfigOptions = {}): OxlintConfig {
  const configs: OxlintConfig[] = [base, typescript, scripts, unicorn];
  switch (testFramework) {
    case "vitest":
      configs.push(vitest);
      break;
    case "jest":
      configs.push(jest);
      break;
  }

  if (jsx) {
    configs.push(jsxA11y, testingLibrary);

    if (jsx !== true) {
      configs.push(react, mui);
    }

    if (jsx === "next") {
      configs.push(nextjs);
    }
  }

  if (overrides) {
    configs.push(overrides);
  }

  const mergedConfig: OxlintConfig = {};
  for (const config of configs) {
    const { plugins = [], overrides = [], ...simple } = config;
    for (const [key, value] of Object.entries(simple)) {
      // @ts-expect-error too lazy to make strict
      const existing = mergedConfig[key];
      if (Array.isArray(existing)) {
        // @ts-expect-error too lazy to make strict
        existing.push(...value);
      } else if (existing && typeof existing === "object") {
        Object.assign(existing, value);
      } else {
        // @ts-expect-error too lazy to make strict
        mergedConfig[key] = value;
      }

      // if (!mergedConfig[key]) {
      //   mergedConfig[key] = value
      // } else if (Array.isArray())
      // // @ts-expect-error too lazy to make strict
      // Object.assign(mergedConfig[key], value);
    }

    mergedConfig.plugins ??= [];
    mergedConfig.plugins.push(...plugins);

    mergedConfig.overrides ??= [];
    for (const override of overrides) {
      const existing = mergedConfig.overrides.find(
        (cnf) => cnf.files === override.files,
      );

      if (existing) {
        existing.rules = {
          ...existing.rules,
          ...override.rules,
        };
        existing.plugins = [
          ...(existing.plugins ?? []),
          ...(override.plugins ?? []),
        ];
        existing.jsPlugins = [
          ...(existing.jsPlugins ?? []),
          ...(override.jsPlugins ?? []),
        ];
      } else {
        mergedConfig.overrides.push(override);
      }
    }
  }

  return mergedConfig;
}
