import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export const ensureParentDir = async (filePath: string): Promise<void> => {
  const folder = dirname(filePath);
  if (!existsSync(folder)) {
    await mkdir(folder, { recursive: true });
  }
};
