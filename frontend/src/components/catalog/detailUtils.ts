// Build "label / value" rows from any record, so detail pages show every field
// without hardcoding each one.

const ALWAYS_EXCLUDE = new Set([
  '_id',
  '__v',
  'id',
  'name',
  'description',
  'specs',
  'generatedImages',
  'imageUrl',
  'createdAt',
  'updatedAt',
]);

/** "service_ceiling" -> "Service Ceiling" */
export function humanize(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Returns every scalar (string/number) field on `record` as { label, value },
 * skipping internal fields and any keys in `exclude` (e.g. ones already shown
 * as the title, badge, meta line, or stat tiles).
 */
export function buildDetailRows(
  record: Record<string, unknown>,
  exclude: string[] = [],
): { label: string; value: string }[] {
  const skip = new Set([...ALWAYS_EXCLUDE, ...exclude]);
  return Object.entries(record)
    .filter(
      ([k, v]) =>
        !skip.has(k) &&
        (typeof v === 'string' || typeof v === 'number') &&
        String(v).trim() !== '',
    )
    .map(([k, v]) => ({ label: humanize(k), value: String(v) }));
}
