function toPartialFilePath(name: string): string {
  const lastSlash = name.lastIndexOf("/");
  if (lastSlash === -1) {
    return (name.startsWith("_") ? "" : "_") + name;
  }

  if (name.slice(lastSlash + 1).startsWith("_")) {
    return name;
  }

  return name.slice(0, lastSlash) + "/_" + name.slice(lastSlash + 1);
}

export function getPossiblePaths(name: string | undefined): readonly string[] {
  if (!name) {
    return [];
  }

  const paths: string[] = [];
  if (name.endsWith(".scss")) {
    paths.push(name);
  } else {
    const unique = new Set([
      toPartialFilePath(name) + ".scss",
      toPartialFilePath(name),
      name + ".scss",
      name,
      name + "/_index.scss",
      name + "/index.scss",
    ]);
    paths.push(...unique);
  }

  return paths;
}
