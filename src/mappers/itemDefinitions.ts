import type { MapContext } from '../context.js';
import type { FunctionItem, InformationItem, ItemDefinition, UnaryTests } from '../types.js';
import { asRecord, asRecordArray, asStr } from '../utils.js';

function mapUnaryTests(raw: unknown): UnaryTests | undefined {
  const r = asRecord(raw);
  if (!r) return undefined;
  const el: UnaryTests = { text: asStr(r.text) ?? '-' };
  const id = asStr(r['@id']);
  if (id !== undefined) el.id = id;
  const lang = asStr(r['@expressionLanguage']);
  if (lang !== undefined) el.expressionLanguage = lang;
  return el;
}

function mapInfoItem(raw: Record<string, unknown>): InformationItem {
  const el: InformationItem = { name: asStr(raw['@name']) ?? '' };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const label = asStr(raw['@label']);
  if (label !== undefined) el.label = label;
  return el;
}

function mapFunctionItem(raw: unknown): FunctionItem | undefined {
  const r = asRecord(raw);
  if (!r) return undefined;
  const el: FunctionItem = {
    parameters: asRecordArray(r.parameters).map(mapInfoItem),
  };
  const id = asStr(r['@id']);
  if (id !== undefined) el.id = id;
  const outputTypeRef = asStr(r['@outputTypeRef']);
  if (outputTypeRef !== undefined) el.outputTypeRef = outputTypeRef;
  return el;
}

export function mapItemDefinitions(raw: unknown, ctx: MapContext): ItemDefinition[] {
  return asRecordArray(raw).map((r) => mapItemDef(r, ctx));
}

function mapItemDef(r: Record<string, unknown>, ctx: MapContext): ItemDefinition {
  const id = asStr(r['@id']) ?? '';
  const el: ItemDefinition = {
    id,
    name: asStr(r['@name']) ?? '',
    isCollection: r['@isCollection'] === true || r['@isCollection'] === 'true',
    itemComponents: asRecordArray(r.itemComponent).map((c) => mapItemDef(c, ctx)),
  };
  const typeRef = asStr(r['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const typeLanguage = asStr(r['@typeLanguage']);
  if (typeLanguage !== undefined) el.typeLanguage = typeLanguage;
  const label = asStr(r['@label']);
  if (label !== undefined) el.label = label;
  const av = mapUnaryTests(r.allowedValues);
  if (av !== undefined) el.allowedValues = av;
  const tc = mapUnaryTests(r.typeConstraint);
  if (tc !== undefined) el.typeConstraint = tc;
  const fi = mapFunctionItem(r.functionItem);
  if (fi !== undefined) el.functionItem = fi;
  if (id) ctx.index.set(id, el);
  return el;
}
