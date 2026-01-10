import { execSync } from "node:child_process";

export const LOCAL_TAGS_COMMAND = "git tag --sort=-creatordate";
export const REMOTE_TAGS_COMMAND = "git ls-remote --tags origin";

function getTags(local: boolean): Set<string> {
  const command = local ? LOCAL_TAGS_COMMAND : REMOTE_TAGS_COMMAND;
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
