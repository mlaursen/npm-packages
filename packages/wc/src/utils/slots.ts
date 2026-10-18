const DEFAULT_OPTIONS = { flatten: true } satisfies AssignedNodesOptions;

export function getEventSlotElements(
  event: Event,
  options: AssignedNodesOptions = DEFAULT_OPTIONS,
): readonly Element[] {
  return (
    (event.currentTarget as HTMLSlotElement | null)?.assignedElements(
      options,
    ) ?? []
  );
}

export function isSlotted(
  event: Event,
  options?: AssignedNodesOptions,
): boolean {
  return getEventSlotElements(event, options).length > 0;
}
