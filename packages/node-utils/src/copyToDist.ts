import { copyFile } from "node:fs/promises";

import { ensureParentDir } from "./ensureParentDir.js";
import { log } from "./logger.js";

export async function copyToDist(path: string, dest: string): Promise<void> {
  await ensureParentDir(dest);
  await copyFile(path, dest);

  log(`Copied ${path} -> ${dest}`);
}
