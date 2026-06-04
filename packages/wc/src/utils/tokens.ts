export function getVar(
  name: `${string}.${string}`,
  fallback?: string | number,
): string {
  let suffix = "";
  if (fallback) {
    suffix = `, ${fallback}`;
  }

  return `var(--mwc-${name.replaceAll(".", "-")}${suffix})`;
}
