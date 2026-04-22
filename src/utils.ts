export function isRecord(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function asStr(val: unknown): string | undefined {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  return trimmed || undefined;
}

export function asRecordArray(val: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(val)) return [];
  return val.filter(isRecord);
}

export function asRecord(val: unknown): Record<string, unknown> | undefined {
  return isRecord(val) ? val : undefined;
}

export function asHref(raw: Record<string, unknown>): string {
  return asStr(raw['@href']) ?? '';
}

export function isIn<T extends string>(values: readonly T[], v: string): v is T {
  for (const val of values) {
    if (val === v) return true;
  }
  return false;
}

export function asEnum<T extends string>(
  values: readonly T[],
  v: string | undefined,
  fallback: T,
): T {
  if (v !== undefined && isIn(values, v)) return v;
  return fallback;
}
