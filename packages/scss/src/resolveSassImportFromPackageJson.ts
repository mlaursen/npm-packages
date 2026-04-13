import {
  type SassResolvePackageJson,
  assertSassResolvePackageJson,
} from "./assertSassResolvePackageJson.js";
import { getPossiblePaths } from "./getPossiblePaths.js";

const SCOPED_MODULE_REGEX = /^(@[^/]+\/[^/]+)(?:\/(.*))?$/;

function getSassExports(
  packageJson: SassResolvePackageJson,
): { main: string; others: Record<string, string> } | undefined {
  let main = "";
  const others: Record<string, string> = {};
  if (packageJson.exports) {
    for (const [relativePath, value] of Object.entries(packageJson.exports)) {
      if (typeof value === "string" || !value || !value.sass) {
        continue;
      }

      const sassPath = value.sass.slice(2);
      const name = relativePath.replace(/^\.\/?/, "");
      if (name) {
        others[name] = sassPath;
      } else {
        main = sassPath;
      }
    }
  } else if (packageJson.sass) {
    main = packageJson.sass;
  } else if (packageJson.main?.endsWith(".scss")) {
    main = packageJson.main;
  }

  if (!main) {
    return;
  }

  return { main, others };
}

export interface ResolveSassImportFromPackageJsonOptions {
  url: string;
  load: (filePath: string) => string;

  basePath: string;
}

export function resolveSassImportFromPackageJson(
  options: ResolveSassImportFromPackageJsonOptions,
): string | null {
  const { url, load, basePath } = options;

  let packageName: string | undefined;
  let packageFilePath: string | undefined;
  if (url.startsWith("@")) {
    [, packageName, packageFilePath] = url.match(SCOPED_MODULE_REGEX) ?? [];
    if (!packageName) {
      return null;
    }
  } else {
    const slashIndex = url.indexOf("/");
    if (slashIndex === -1) {
      packageName = url;
    } else {
      packageName = url.slice(0, slashIndex);
      packageFilePath = url.slice(slashIndex + 1);
    }
  }

  const packageBasePath = `${basePath}/node_modules/${packageName}`;
  let packageJson: SassResolvePackageJson;
  try {
    const contents = load(`${packageBasePath}/package.json`);
    const parsed = JSON.parse(contents);
    assertSassResolvePackageJson(parsed);
    packageJson = parsed;
  } catch {
    return null;
  }

  const resolvedPaths = getSassExports(packageJson);
  if (!resolvedPaths) {
    return null;
  }

  const possiblePaths = [
    ...getPossiblePaths(resolvedPaths.others[packageFilePath ?? ""]),
    resolvedPaths.main,
  ];

  for (const path of possiblePaths) {
    if (!path) {
      continue;
    }

    try {
      const joined = `${basePath}/node_modules/${packageName}/${path}`;
      load(joined);
      return joined;
    } catch {
      continue;
    }
  }

  return null;
}
