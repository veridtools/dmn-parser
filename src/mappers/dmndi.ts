import type { DMNDI } from '../types.js';
import { asRecord, asRecordArray } from '../utils.js';

export function mapDMNDI(raw: unknown): DMNDI | undefined {
  const r = asRecord(raw);
  if (!r) return undefined;
  return { diagrams: asRecordArray(r.DMNDiagram) };
}
