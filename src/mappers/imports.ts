import type { Import } from '../types.js';
import { asRecordArray, asStr } from '../utils.js';

export function mapImports(raw: unknown): Import[] {
  return asRecordArray(raw).map((r) => {
    const el: Import = {
      name: asStr(r['@name']) ?? '',
      importType: asStr(r['@importType']) ?? '',
    };
    const id = asStr(r['@id']);
    if (id !== undefined) el.id = id;
    const ns = asStr(r['@namespace']);
    if (ns !== undefined) el.namespace = ns;
    const loc = asStr(r['@locationURI']);
    if (loc !== undefined) el.locationURI = loc;
    return el;
  });
}
