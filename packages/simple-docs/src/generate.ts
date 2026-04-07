import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  type Options as PrettierOptions,
  format,
  resolveConfig,
} from "prettier";

import { getDocs } from "./getDocs.js";

const START_TOKEN = "<!-- examples-start -->";
const END_TOKEN = "<!-- examples-end -->";

export async function generate(): Promise<void> {
  if (!existsSync("README.md")) {
    throw new Error("Missing README.md");
  }

  const readme = readFileSync("README.md", "utf8");
  const startIndex = readme.indexOf(START_TOKEN);
  const endIndex = readme.indexOf(END_TOKEN, startIndex);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Missing ${START_TOKEN} and ${END_TOKEN} in README.md`);
  }

  const docs = await getDocs();
  if (docs.length === 0) {
    throw new Error("No documented functions found.");
  }

  let content = `${START_TOKEN}
`;
  for (const doc of docs) {
    content += `## ${doc.name}

${doc.examples
  .map((example) => {
    return `### ${example.name}

${example.content}
`;
  })
  .join("\n\n")}
`;
  }

  const filePath = join(process.cwd(), "README.md");
  const config: PrettierOptions = { filepath: filePath };
  try {
    const resolvedConfig = await resolveConfig(filePath);
    Object.assign(config, resolvedConfig);
  } catch {
    // do nothing
  }

  writeFileSync(
    "README.md",
    await format(
      readme.slice(0, startIndex) + content + readme.slice(endIndex),
      config
    )
  );
}
