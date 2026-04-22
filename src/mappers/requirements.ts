import type {
  AuthorityRequirement,
  DMNElementRef,
  InformationRequirement,
  KnowledgeRequirement,
} from '../types.js';
import { asHref, asRecord, asRecordArray, asStr } from '../utils.js';

export function mapDMNElementRef(raw: Record<string, unknown>): DMNElementRef {
  return { href: asHref(raw) };
}

export function mapOptionalRef(raw: unknown): DMNElementRef | undefined {
  const r = asRecord(raw);
  return r ? mapDMNElementRef(r) : undefined;
}

export function mapInfoReqs(raw: unknown): InformationRequirement[] {
  return asRecordArray(raw).map((r) => {
    const el: InformationRequirement = {};
    const id = asStr(r['@id']);
    if (id !== undefined) el.id = id;
    const rd = asRecord(r.requiredDecision);
    if (rd) el.requiredDecision = mapDMNElementRef(rd);
    const ri = asRecord(r.requiredInput);
    if (ri) el.requiredInput = mapDMNElementRef(ri);
    return el;
  });
}

export function mapKnowledgeReqs(raw: unknown): KnowledgeRequirement[] {
  return asRecordArray(raw).map((r) => {
    const el: KnowledgeRequirement = {
      requiredKnowledge: mapDMNElementRef(asRecord(r.requiredKnowledge) ?? {}),
    };
    const id = asStr(r['@id']);
    if (id !== undefined) el.id = id;
    return el;
  });
}

export function mapAuthorityReqs(raw: unknown): AuthorityRequirement[] {
  return asRecordArray(raw).map((r) => {
    const el: AuthorityRequirement = {};
    const id = asStr(r['@id']);
    if (id !== undefined) el.id = id;
    const rd = asRecord(r.requiredDecision);
    if (rd) el.requiredDecision = mapDMNElementRef(rd);
    const ri = asRecord(r.requiredInput);
    if (ri) el.requiredInput = mapDMNElementRef(ri);
    const ra = asRecord(r.requiredAuthority);
    if (ra) el.requiredAuthority = mapDMNElementRef(ra);
    return el;
  });
}

export function mapHrefs(raw: unknown): DMNElementRef[] {
  return asRecordArray(raw).map(mapDMNElementRef);
}
