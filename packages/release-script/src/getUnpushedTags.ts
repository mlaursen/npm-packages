import { execSync } from "node:child_process";

function getTags(local: boolean): Set<string> {
  const command = local
    ? "git tag --sort=-creatordate"
    : "git ls-remote --tags origin";
  const tags = execSync(command).toString().trim();
  const lines = tags.split(/\r?\n/);
  if (local) {
    return new Set(lines);
  }

  return new Set(
    lines.map((line) => line.replace(/^.+refs\/tags\//, "").replace("^{}", ""))
  );
}

export function getUnpushedTags(): readonly string[] {
  const localTags = getTags(true);
  const pushedTags = getTags(false);

  return [...localTags.difference(pushedTags)];
}
