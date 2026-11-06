import { createRequire, isBuiltin } from "node:module";
import { pathToFileURL } from "node:url";

/** @internal */
export function isProbablyErrnoException(
  error: unknown,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

/** @internal */
export function isModuleNotFound(
  error: NodeJS.ErrnoException,
  name: string,
): boolean {
  return (
    error.code === "ERR_MODULE_NOT_FOUND" ||
    error.code === "MODULE_NOT_FOUND" ||
    error.message.includes(`'${name}'`)
  );
}

function isOnlyInteropKeys(imported: Record<string, unknown>): boolean {
  return Object.entries(imported).every(
    ([key, value]) =>
      key === "default" || key === "__esModule" || value === undefined,
  );
}

/**
 * This is a small util to be able to dynamically import packages that are
 * listed as optional peer dependencies.
 */
export async function importOptional<T>(
  name: string,
  feature: string,
  from = process.cwd(),
): Promise<T> {
  try {
    const specifier =
      isBuiltin(name) || name.startsWith("file:")
        ? name
        : pathToFileURL(createRequire(from).resolve(name)).href;

    const imported = await import(specifier);
    if ("module.exports" in imported) {
      return imported["module.exports"];
    }

    if (typeof imported.default === "function" && isOnlyInteropKeys(imported)) {
      return imported.default;
    }

    return imported;
  } catch (error) {
    if (isProbablyErrnoException(error) && isModuleNotFound(error, name)) {
      throw new Error(
        `${feature} requires "${name}". Install it with: npm i -D ${name}`,
        { cause: error },
      );
    }

    throw error;
  }
}
