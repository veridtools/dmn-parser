// Whitespace normalization is applied inside normalizeNode (normalize/defaults.ts)
// as part of a single tree pass. This module exposes a standalone helper for
// trimming a free-text string while preserving internal whitespace (multiline
// FEEL expressions are valid).

export function trimText(value: string): string {
  return value.trim();
}
