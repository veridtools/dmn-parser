import type { MapContext } from '../context.js';
import type { ElementCollection, OrganizationUnit, PerformanceIndicator } from '../types.js';
import { asRecordArray, asStr } from '../utils.js';
import { mapHrefs } from './requirements.js';

export function mapPerformanceIndicators(raw: unknown, ctx: MapContext): PerformanceIndicator[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: PerformanceIndicator = {
      id,
      name: asStr(r['@name']) ?? '',
      impactingDecisions: mapHrefs(r.impactingDecision),
    };
    const description = asStr(r['@description']);
    if (description !== undefined) el.description = description;
    const URI = asStr(r['@URI']);
    if (URI !== undefined) el.URI = URI;
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    if (id) ctx.index.set(id, el);
    return el;
  });
}

export function mapOrganizationUnits(raw: unknown, ctx: MapContext): OrganizationUnit[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: OrganizationUnit = {
      id,
      name: asStr(r['@name']) ?? '',
      decisionMade: mapHrefs(r.decisionMade),
      decisionOwned: mapHrefs(r.decisionOwned),
    };
    const description = asStr(r['@description']);
    if (description !== undefined) el.description = description;
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    if (id) ctx.index.set(id, el);
    return el;
  });
}

export function mapElementCollections(raw: unknown, ctx: MapContext): ElementCollection[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: ElementCollection = { id, drgElements: mapHrefs(r.drgElement) };
    const name = asStr(r['@name']);
    if (name !== undefined) el.name = name;
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    if (id) ctx.index.set(id, el);
    return el;
  });
}
