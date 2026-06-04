const DEFAULT_OPTIONS = { flatten: true } satisfies AssignedNodesOptions;

export function isSlotted(
  event: Event,
  options: AssignedNodesOptions = DEFAULT_OPTIONS,
): boolean {
  const elements =
    (event.currentTarget as HTMLSlotElement | null)?.assignedElements(
      options,
    ) ?? [];

  return elements.length > 0;
}
