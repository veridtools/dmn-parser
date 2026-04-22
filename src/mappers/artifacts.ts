import type { MapContext } from '../context.js';
import type { Association, AssociationDirection, Group, TextAnnotation } from '../types.js';
import { asRecord, asRecordArray, asStr } from '../utils.js';
import { mapDMNElementRef } from './requirements.js';

export function mapTextAnnotations(raw: unknown, ctx: MapContext): TextAnnotation[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: TextAnnotation = {
      id,
      text: asStr(r.text) ?? asStr(r['@text']) ?? '',
      textFormat: asStr(r['@textFormat']) ?? 'text/plain',
    };
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    if (id) ctx.index.set(id, el);
    return el;
  });
}

export function mapAssociations(raw: unknown, ctx: MapContext): Association[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: Association = {
      id,
      associationDirection: (asStr(r['@associationDirection']) ?? 'None') as AssociationDirection,
      sourceRef: mapDMNElementRef(asRecord(r.sourceRef) ?? { '@href': '' }),
      targetRef: mapDMNElementRef(asRecord(r.targetRef) ?? { '@href': '' }),
    };
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    if (id) ctx.index.set(id, el);
    return el;
  });
}

export function mapGroups(raw: unknown, ctx: MapContext): Group[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: Group = { id };
    const name = asStr(r['@name']);
    if (name !== undefined) el.name = name;
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    if (id) ctx.index.set(id, el);
    return el;
  });
}
