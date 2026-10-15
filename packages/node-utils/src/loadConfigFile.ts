import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

export interface LoadConfigFileOptions {
  /**
   * Optional path to the env file.
   *
   * @defaultValue `".env"`
   */
  path?: string;

  /**
   * Set to `true` to override existing process.env values. When this is
   * `false`, it will only set it if `undefined`.
   *
   * @defaultValue `false`
   */
  override?: boolean;
}

/**
 * Simple replacement for `dotenv` since I no longer trust it after the
 * `dotenv-expand@1000` release.
 *
 * @example Simple Example
 * ```ts
 * // uses `".env"`
 * loadConfigFile();
 *
 * // use `".env.local"` and override existing values
 * loadConfigFile({ path: ".env.local", override: true });
 * ```
 */
export function loadConfigFile(options: LoadConfigFileOptions = {}): void {
  const { path = ".env", override } = options;

  try {
    const env = parseEnv(readFileSync(path, "utf8"));
    if (override) {
      Object.assign(process.env, env);
    } else {
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    // allow missing files, throw others
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
}
